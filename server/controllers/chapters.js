import Chapter from "../models/chapters.js";
import Question from "../models/questions.js";


export const getChapters = async (req, res) => {
  try {
    const chapters = await Chapter.aggregate([
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "chapter_id",
          as: "questions",
        },
      },
      {
        $addFields: {
          questionCount: { $size: "$questions" },
        },
      },
      {
        $lookup: {
          from: "subjects",
          localField: "subject_id",
          foreignField: "_id",
          as: "subject",
        },
      },
      {
        $unwind: "$subject"
      },
      {
        $project: {
          _id: 1,
          chapter_name: 1,
          chapter_number: 1,
          subject_id: "$subject",
          questionCount: 1,
        },
      },
    ]);

    res.status(200).json({ chapters });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get chapters by subject
export const getChaptersBySubject = async (req, res) => {
  try {
    const chapters = await Chapter.find({ subject_id: req.params.subjectId });
    res.status(200).json({ chapters });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create chapter
export const createChapter = async (req, res) => {
  const { subject_id, chapter_name, chapter_number } = req.body;
  try {
    const newChapter = new Chapter({ subject_id, chapter_name, chapter_number });
    await newChapter.save();
    res.status(201).json({ success: true, chapter: newChapter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update chapter
export const updateChapter = async (req, res) => {
  const { id } = req.params;
  const { subject_id, chapter_name, chapter_number } = req.body;
  try {
    const updated = await Chapter.findByIdAndUpdate(
      id,
      { subject_id, chapter_name, chapter_number },
      { new: true }
    );
    res.status(200).json({ success: true, chapter: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteChapter = async (req, res) => {
  try {
    const chapterId = req.params.id;

    // ✅ Check if this chapter is referenced by any question
    const isReferenced = await Question.findOne({ chapter_id: chapterId });

    if (isReferenced) {
      return res.status(400).json({
        message: "❌ Cannot delete: Chapter is referenced by one or more questions.",
      });
    }

    const deleted = await Chapter.findByIdAndDelete(chapterId);
    if (!deleted) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    res.status(200).json({ success: true, message: "✅ Chapter deleted successfully" });
  } catch (error) {
    console.error("Error deleting chapter:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

