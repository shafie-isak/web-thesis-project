import PastExam from '../models/PastExam.js';

// Upload past exam
export const uploadPastExam = async (req, res) => {
  try {
    const { title, year, subject } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'PDF file is required.' });
    }

    const newExam = new PastExam({
      title,
      year,
      subject,
      category: 'Form 4',
      pdfUrl: `/uploads/past_exams/${file.filename}`,
    });

    await newExam.save();
    res.status(201).json(newExam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Get exams with optional filters
export const getAllPastExams = async (req, res) => {
  try {
    const { year, subject } = req.query;

    const filter = {};
    if (year) filter.year = Number(year); // Ensure year is number
    if (subject) filter.subject = new RegExp(subject, 'i'); // case-insensitive

    const exams = await PastExam.find(filter).sort({ year: -1 });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
