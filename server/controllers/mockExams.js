import Chapter from '../models/chapters.js';
import Question from '../models/questions.js';
import Subject from '../models/subjects.js';
import MockExam from '../models/mock_exam.js';
import MockExamResult from '../models/mock_exam_result.js';
import MockExamProgress from '../models/mock_exam_progress.js';
import mongoose from 'mongoose';

/**
 * Create mock exam based on selected subject, number of questions, and time limit.
 */
export const createMockExam = async (req, res) => {
  try {
    const { subject_id, numberOfQuestions, timeLimit } = req.body;

    const chapters = await Chapter.find({ subject_id }).select('_id');
    if (!chapters.length) return res.status(404).json({ message: 'No chapters found.' });

    const chapterIds = chapters.map(ch => ch._id.toString());
    const selectedQuestionIds = new Set();

    while (selectedQuestionIds.size < numberOfQuestions && chapterIds.length > 0) {
      const randomChapterId = chapterIds[Math.floor(Math.random() * chapterIds.length)];
      const questions = await Question.find({ chapter_id: randomChapterId }).select('_id');

      if (!questions.length) {
        chapterIds.splice(chapterIds.indexOf(randomChapterId), 1);
        continue;
      }

      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      selectedQuestionIds.add(randomQuestion._id.toString());
    }

    const questionIdsArray = Array.from(selectedQuestionIds).map(id => new mongoose.Types.ObjectId(id));
    const subject = await Subject.findById(subject_id).select('subject_name');
    if (!subject) return res.status(404).json({ message: 'Subject not found.' });

    // 🧠 Generate unique title
    const baseTitle = `Mock Exam - ${subject.subject_name}`;
    const existingExams = await MockExam.find({ title: new RegExp(`^${baseTitle}( \\(\\d+\\))?$`, 'i') });

    let finalTitle = baseTitle;
    if (existingExams.length > 0) {
      const numbers = existingExams.map(exam => {
        const match = exam.title.match(/\((\d+)\)$/);
        return match ? parseInt(match[1]) : 0;
      });
      const max = Math.max(...numbers, 0);
      finalTitle = `${baseTitle} (${max + 1})`;
    }

    const newMock = await MockExam.create({
      title: finalTitle,
      subject_id,
      question_ids: questionIdsArray,
      createdAt: new Date(),
      timeLimit: timeLimit || 3600,
    });

    res.status(201).json(newMock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMockExams = async (req, res) => {
  try {
    const exams = await MockExam.find().populate("subject_id");
    res.status(200).json(exams);
  } catch (err) {
    res.status(500).json({ message: "Failed to get mock exams" });
  }
};


export const updateMockExam = async (req, res) => {
  try {
    const updated = await MockExam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};



export const deleteMockExam = async (req, res) => {
  try {
    const examId = req.params.id;

    // Step 1: Delete related MockExamResults
    await MockExamResult.deleteMany({ mockExamId: examId });

    // Step 2: Delete related MockExamProgress
    await MockExamProgress.deleteMany({ mockExamId: examId });

    // Step 3: Delete the MockExam itself
    await MockExam.findByIdAndDelete(examId);

    res.status(200).json({ message: "Mock exam and all related data deleted successfully." });
  } catch (err) {
    console.error("❌ Delete failed:", err.message);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

