import PastExam from '../models/PastExam.js';
import fs from 'fs';
import path from 'path';

// Upload new exam
export const uploadPastExam = async (req, res) => {
  try {
    const { title, year, subject, category } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'PDF file is required.' });

    const newExam = new PastExam({
      title,
      year,
      subject,
      category,
      pdfUrl: `/uploads/past_exams/${file.filename}`,
    });

    await newExam.save();
    res.status(201).json(newExam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all exams with optional filters
export const getAllPastExams = async (req, res) => {
  try {
    const { year, subject } = req.query;
    const filter = {};
    if (year) filter.year = Number(year);
    if (subject) filter.subject = new RegExp(subject, 'i');

    const exams = await PastExam.find(filter).sort({ year: -1 });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single exam
export const getPastExamById = async (req, res) => {
  try {
    const exam = await PastExam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update exam
export const updatePastExam = async (req, res) => {
  try {
    const { title, year, subject, category } = req.body;
    const exam = await PastExam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    if (req.file) {
      // Delete old file
      const oldPath = path.join('uploads/past_exams', path.basename(exam.pdfUrl));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      exam.pdfUrl = `/uploads/past_exams/${req.file.filename}`;
    }

    exam.title = title || exam.title;
    exam.year = year || exam.year;
    exam.subject = subject || exam.subject;
    exam.category = category || exam.category;

    await exam.save();
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete exam
export const deletePastExam = async (req, res) => {
  try {
    const exam = await PastExam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // Delete the PDF file
    const filePath = path.join('uploads/past_exams', path.basename(exam.pdfUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await exam.deleteOne();
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
