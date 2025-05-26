// routes/admin.js

import express from 'express';
import User from '../models/users.js';
import Subject from '../models/subjects.js';
import Chapter from '../models/chapters.js';
import PastExam from '../models/PastExam.js';
import MockExam from '../models/mock_exam.js';
import Challenge from '../models/challenges.js';

const router = express.Router();

router.get('/dashboard-summary', async (req, res) => {
  try {
    const [userCount, subjectCount, chapterCount, pastExamCount, mockExamCount, challengeCount] = await Promise.all([
      User.countDocuments(),
      Subject.countDocuments(),
      Chapter.countDocuments(),
      PastExam.countDocuments(),
      MockExam.countDocuments(),
      Challenge.countDocuments(),
    ]);

    res.status(200).json({
      users: userCount,
      subjects: subjectCount,
      chapters: chapterCount,
      pastExams: pastExamCount,
      mockExams: mockExamCount,
      challenges: challengeCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard data', error });
  }
});

export default router;
