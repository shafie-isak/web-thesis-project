import Question from "../models/questions.js";

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate({
        path: "chapter_id",
        populate: { path: "subject_id" }, 
      })
      .sort({ createdAt: -1 }).limit(100);

    res.status(200).json({ questions });
  } catch (err) {
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
