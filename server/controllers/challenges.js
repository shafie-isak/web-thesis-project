// controllers/challengeController.js
import Challenge from '../models/challenges.js';
import ChallengeResult from '../models/challenge_result.js';
import Question from '../models/questions.js';
import { format } from 'date-fns';
import ChallengeProgress from '../models/challenge_result.js'; 

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


export const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ startDate: -1 });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const createChallenge = async (req, res) => {
  try {
    const { type, description, timeLimit, numberOfQuestions, startDate, endDate } = req.body;

    // ✅ Validate
    if (!type || !numberOfQuestions) {
      return res.status(400).json({ message: 'type and numberOfQuestions are required.' });
    }

    // ✅ Format title: e.g., "daily - Challenge - May 29, 2025"
    const baseTitle = `${type} Challenge - ${format(new Date(), 'PPP')}`;
    

    // ✅ Check for duplicates and append (1), (2), ...
    let title = baseTitle;
    let counter = 1;
    while (await Challenge.findOne({ title })) {
      title = `${baseTitle} (${counter})`;
      counter++;
    }

    // ✅ Pick random questions
    const questions = await Question.aggregate([{ $sample: { size: parseInt(numberOfQuestions) } }]);

    // ✅ Create challenge
    const challenge = new Challenge({
      title,
      type,
      description,
      timeLimit,
      questionIds: questions.map(q => q._id),
      startDate: startDate || new Date(),
      endDate: endDate || new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    await challenge.save();

    res.status(201).json({ message: '✅ Challenge created with random questions', challenge });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      description,
      timeLimit,
      numberOfQuestions,
      startDate,
      endDate
    } = req.body;

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // ✅ Update basic fields
    if (req.body.title) challenge.title = req.body.title;
    if (type) challenge.type = type;
    if (description !== undefined) challenge.description = description;
    if (timeLimit !== undefined) challenge.timeLimit = timeLimit;
    if (startDate) challenge.startDate = new Date(startDate);
    if (endDate) challenge.endDate = new Date(endDate);

    // ✅ If numberOfQuestions is provided, re-pick random questions
    if (numberOfQuestions) {
      const questions = await Question.aggregate([{ $sample: { size: parseInt(numberOfQuestions) } }]);
      challenge.questionIds = questions.map(q => q._id);
    }

    await challenge.save();

    res.status(200).json({ message: '✅ Challenge updated', challenge });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteChallenge = async (req, res) => {
  try {
    const { id } = req.params;

    const challenge = await Challenge.findById(id);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    // ✅ Delete related results and progress
    await ChallengeResult.deleteMany({ challengeId: id });
    await ChallengeProgress.deleteMany?.({ challengeId: id }); // ✅ optional: only if exists

    // ✅ Delete the challenge itself
    await Challenge.findByIdAndDelete(id);

    res.status(200).json({ message: "✅ Challenge and related data deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
