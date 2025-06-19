import Question from "../models/questions.js";

export const getQuestions = async (req, res) => {
  try {
    const subjectId = req.query.subject || null;
    const chapterId = req.query.chapter || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const filter = {};

    if (subjectId) {
      filter['chapter_id.subject_id'] = subjectId;
    }

    if (chapterId) {
      filter['chapter_id'] = chapterId;
    }

    const questions = await Question.find(filter)
      .populate({
        path: "chapter_id",
        populate: { path: "subject_id" }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Question.countDocuments(filter);

    res.status(200).json({
      questions,
      total,
      page,
      pages: Math.ceil(total / limit)
    });

  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ message: err.message });
  }
};



export const createQuestion = async (req, res) => {
  try {
    const { question, options, answer, difficulty_level, chapter_id } = req.body;
    const newQuestion = new Question({ question, options, answer, difficulty_level, chapter_id });
    await newQuestion.save();
    res.status(201).json({ message: "Question created", question: newQuestion });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Question not found" });
    res.status(200).json({ message: "Question updated", question: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Question not found" });
    res.status(200).json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
