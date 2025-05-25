import cron from 'node-cron';
import Subject from '../models/subjects.js';

import { generateMockExam } from '../services/generateMockExams.js';


cron.schedule('0 0 * * *', async () => {
  console.log('[CRON] Running mock exam generator');

  try {
    const subjects = await Subject.find({});
    for (const subject of subjects) {
      await generateMockExam(subject._id, 50);
      console.log(`✅ Auto-generated mock exam for: ${subject.subject_name}`);
    }
  } catch (err) {
    console.error(`[CRON ERROR] ${err.message}`);
  }
}, {
  timezone: 'Africa/Mogadishu'
});
