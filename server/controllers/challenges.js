// controllers/challengeController.js
import Challenge from '../models/challenges.js';
import ChallengeResult from '../models/challenge_result.js';
import Question from '../models/questions.js';

// GET /api/challenges/daily
export const getDailyChallenge = async (req, res) => {
  try {
    const today = new Date();
    const challenge = await Challenge.find({
      type: 'daily',
    }).populate('questionIds');

    if (!challenge) return res.status(404).json({ message: 'No daily challenge available' });
    res.status(200).json({challenge});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// GET /api/challenges/weekly
export const getWeeklyChallenge = async (req, res) => {
  try {
    const today = new Date();
    const challenge = await Challenge.findOne({
      type: 'weekly',
      startDate: { $lte: today },
      endDate: { $gte: today }
    }).populate('questionIds');

    if (!challenge) return res.status(404).json({ message: 'No weekly challenge available' });
    res.status(200).json(challenge);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// POST /api/challenges/submit
export const submitChallengeResult = async (req, res) => {
  try {
    const { userId, challengeId, score, total, timeTaken } = req.body;

    const result = new ChallengeResult({ userId, challengeId, score, total, timeTaken });
    await result.save();

    res.status(201).json({ message: 'Challenge result saved successfully' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
