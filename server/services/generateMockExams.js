import Chapter from '../models/chapters.js';
import Question from '../models/questions.js';
import Subject from '../models/subjects.js';
import MockExam from '../models/mock_exam.js';
import mongoose from 'mongoose';

/**
 * Generates a mock exam with random questions from chapters under a subject.
 * @param {String|ObjectId} subjectId
 * @param {Number} numQuestions
 * @returns {Promise<MockExam>}
 */
export async function generateMockExam(subjectId, numQuestions = 50) {
  const chapters = await Chapter.find({ subject_id: subjectId }).select('_id');
  if (chapters.length === 0) throw new Error('No chapters found for this subject.');

  const chapterIds = chapters.map(ch => ch._id.toString());
  const selectedQuestionIds = new Set();

  while (selectedQuestionIds.size < numQuestions) {
    const randomChapterId = chapterIds[Math.floor(Math.random() * chapterIds.length)];

    const questions = await Question.find({ chapter_id: randomChapterId }).select('_id');
    if (!questions.length) {
      chapterIds.splice(chapterIds.indexOf(randomChapterId), 1);
      if (chapterIds.length === 0) break;
      continue;
    }

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    selectedQuestionIds.add(randomQuestion._id.toString());

    if (selectedQuestionIds.size >= numQuestions) break;
  }

  const questionIdsArray = Array.from(selectedQuestionIds).map(id => new mongoose.Types.ObjectId(id));

  
const subject = await Subject.findById(subjectId).select('subject_name');
if (!subject) throw new Error('Subject not found');

  const mockExam = await MockExam.create({
    title: `Mock Exam - ${subject.subject_name}`,
    subject_id: new mongoose.Types.ObjectId(subjectId),
    question_ids: questionIdsArray,
    createdAt: new Date(),
  });

  return mockExam;
}
