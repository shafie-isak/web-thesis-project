import MockExamResult from '../models/mock_exam_result.js';
import MockExam from '../models/mock_exam.js';
import Subject from '../models/subjects.js';


export const getMockProgressBySubject = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🔍 Fetching results for userId:", userId);

    const results = await MockExamResult.find({ userId });
    console.log("✅ Results found:", results.length);

    const summaries = [];

    for (const result of results) {
      const mock = await MockExam.findById(result.mockExamId);
      if (!mock) {
        // console.log("⚠️ Mock not found for ID:", result.mockExamId);
        continue;
      }

      const subject = await Subject.findById(mock.subject_id);
      if (!subject) {
        // console.log("⚠️ Subject not found for ID:", mock.subject_id);
        continue;
      }

    //   const answered = result.answers.filter(ans => ans !== null).length;
      const correct = result.score;

      const existing = summaries.find(s => s.subject === subject.subject_name);
      if (existing) {
        existing.answered += correct;
        existing.total += result.total;
      } else {
        summaries.push({
          subject: subject.subject_name,
          correct,
          total: result.total
        });
      }
    }

    console.log("✅ Summary created:", summaries);
    res.status(200).json(summaries);
  } catch (error) {
    console.error("❌ getMockProgressBySubject error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
