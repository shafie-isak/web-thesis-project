import cron from 'node-cron';
import Challenge from '../models/challenges.js';
import Question from '../models/questions.js';

export const scheduleDailyChallenge = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('🕛 Generating new daily challenge...');

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
      endDate: tomorrow
    });

    await challenge.save();
    console.log('✅ Daily challenge created successfully!');
  });
};
