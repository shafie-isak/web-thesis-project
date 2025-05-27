import Subject from "../models/subjects.js";
import Chapter from "../models/chapters.js"; 



// ✅ CREATE Subject
export const createSubject = async (req, res) => {
  const { subject_name, icon } = req.body;
  if (!subject_name || !icon) {
    return res.status(400).json({ message: "Subject name and icon are required" });
  }

  try {
    const existing = await Subject.findOne({ subject_name });
    if (existing) {
      return res.status(409).json({ message: "Subject already exists" });
    }

    const newSubject = new Subject({ subject_name, icon });
    await newSubject.save();
    return res.status(201).json({ success: true, subject: newSubject });
  } catch (error) {
    console.error("❌ Error creating subject:", error.message);
    res.status(500).json({ message: error.message });
  }
};


export const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({});
        res.status(200).json({ subjects });
    } catch (error) {
        console.log("error getting subjects: ", error.message);
        return res.status(401).json({ message: error.message });
    }
}


// ✅ UPDATE Subject
export const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { subject_name, icon } = req.body;

  try {
    const updated = await Subject.findByIdAndUpdate(
      id,
      { subject_name, icon },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Subject not found" });
    }

    return res.status(200).json({ success: true, subject: updated });
  } catch (error) {
    console.error("❌ Error updating subject:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE Subject
export const deleteSubject = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if any chapters reference this subject
    const isReferenced = await Chapter.findOne({ subject_id: id });
    if (isReferenced) {
      return res.status(400).json({
        message: "❌ Cannot delete: Subject is referenced by chapters.",
      });
    }

    // Optional: check if used in quizzes
    // const isUsedInQuiz = await Quiz.findOne({ subject: id });
    // if (isUsedInQuiz) {
    //   return res.status(400).json({ message: "Subject used in quizzes." });
    // }

    const deleted = await Subject.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Subject not found" });
    }

    return res.status(200).json({ message: "✅ Subject deleted" });
  } catch (error) {
    console.error("❌ Error deleting subject:", error.message);
    res.status(500).json({ message: error.message });
  }
};

