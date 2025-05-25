// routes/challenges.js
import express from 'express';
import {
  getDailyChallenge,
  getWeeklyChallenge,
  submitChallengeResult
} from '../controllers/challenges.js';
import Question from '../models/questions.js'; // ✅ correct relative path
import Challenge from '../models/challenges.js'; // ✅ correct relative path

const router = express.Router();

router.get('/daily', getDailyChallenge);
router.get('/weekly', getWeeklyChallenge);
router.post('/submit', submitChallengeResult);

// routes/challenges.js
router.post('/generate-daily', async (req, res) => {
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
  
      const questions = await Question.aggregate([{ $sample: { size: 10 } }]);
  
      const challenge = new Challenge({
        type: 'daily',
        title: `Daily Challenge - ${today.toDateString()}`,
        questionIds: questions.map(q => q._id),
        timeLimit: 120,
        startDate: today,
        endDate: tomorrow,
      });
  
      await challenge.save();
      res.status(201).json({ message: '✅ Daily challenge generated successfully!' });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });
  

export default router;
