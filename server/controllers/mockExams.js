import { generateMockExam } from '../services/generateMockExams.js';
import MockExam from '../models/mock_exam.js'
import MockExamResult from '../models/mock_exam_result.js';
import MockExamProgress from '../models/mock_exam_progress.js'
import mongoose from 'mongoose';
import Question from '../models/questions.js';


export const createMockExam = async (req, res) => {
  const { subjectId, size = 50 } = req.body;
  if (!subjectId) return res.status(400).json({ error: 'subjectId is required' });

  try {
    const mockExam = await generateMockExam(subjectId, size);
    res.json(mockExam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllMockExams = async (req, res) => {
  try {
    const userId = req.user.id;
    const exams = await MockExam.find().select('title subject _id question_ids timeLimit');
    const results = await MockExamResult.find({ userId });
    const progresses = await MockExamProgress.find({ userId });

    const enrichedExams = exams.map((exam) => {
      const result = results.find(r => r.mockExamId.toString() === exam._id.toString());
      const progress = progresses.find(p => p.mockExamId.toString() === exam._id.toString());

      let status = 'not_started';
      let progressCount = 0;

      if (result) {
        status = 'completed';
      } else if (progress) {
        status = 'in_progress';
        progressCount = progress.answers.filter(a => a !== null).length;
      }

      return {
        _id: exam._id,
        title: exam.title,
        subject: exam.subject,
        question_ids: exam.question_ids,
        timeLimit: exam.timeLimit,
        status,
        progress: progressCount,
      };
    });

    res.status(200).json(enrichedExams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMockExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if already submitted
    const alreadyTaken = await MockExamResult.findOne({ userId, mockExamId: id });
    if (alreadyTaken) {
      return res.status(403).json({ message: "You already took this exam." });
    }

    // Load mock exam
    const mock = await MockExam.findById(id).populate('question_ids');
    if (!mock) return res.status(404).json({ message: "Exam not found" });

    res.status(200).json(mock);
  } catch (error) {
    console.error("❌ Mock fetch error:", error.message);
    res.status(500).json({ message: error.message });
  }
};



export const getMockResultByExamId = async (req, res) => {
  try {
    const { mockExamId } = req.params;
    const userId = req.user.id;

    if (!mockExamId || typeof mockExamId !== 'string') {
      return res.status(400).json({ message: 'mockExamId is required and must be a string' });
    }

    const cleanId = mockExamId.trim();

    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      return res.status(400).json({ message: 'Invalid exam ID format' });
    }

    const result = await MockExamResult.findOne({
      userId,
      mockExamId: new mongoose.Types.ObjectId(cleanId),
    });

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    const exam = await MockExam.findById(cleanId).lean();
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const questionMap = await Question.find({ _id: { $in: exam.question_ids } })
      .lean()
      .then((docs) => {
        const map = {};
        for (const doc of docs) {
          map[doc._id.toString()] = doc;
        }
        return map;
      });

    const fullQuestions = exam.question_ids.map(qid => questionMap[qid.toString()]);


    return res.status(200).json({
      ...result.toObject(),
      questions: fullQuestions,
    });
  } catch (error) {
    console.error("🔥 BACKEND ERROR:", error.message);
    return res.status(500).json({ message: error.message });
  }
};



export const submitMockResult = async (req, res) => {
  try {
    const { mockExamId, score, total, timeTaken, answers } = req.body;
    const userId = req.user.id;

    const alreadySubmitted = await MockExamResult.findOne({ userId, mockExamId });
    if (alreadySubmitted) {
      return res.status(409).json({ message: 'Exam already submitted' });
    }

    const result = new MockExamResult({
      userId,
      mockExamId,
      score,
      total,
      timeTaken,
      answers,
    });

    await result.save();
    res.status(201).json({ message: 'Result saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const saveMockProgress = async (req, res) => {
  try {
    const { mockExamId, answers, remainingSeconds } = req.body;
    const userId = req.user.id;

    await MockExamProgress.findOneAndUpdate(
      { userId, mockExamId },
      { answers, remainingSeconds, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Progress saved to database" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resumeMockProgress = async (req, res) => {
  try {
    const { mockExamId } = req.params;
    const userId = req.user.id;

    const progress = await MockExamProgress.findOne({ userId, mockExamId });

    if (progress) {
      return res.status(200).json({
        answers: progress.answers,
        remainingSeconds: progress.remainingSeconds,
        updatedAt: progress.updatedAt
      });
    } else {
      return res.status(404).json({ message: "No saved progress" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



