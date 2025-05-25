import mongoose from "mongoose";

// const ExamSchema = new mongoose.Schema({
//     userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
//     questionId: {type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true},
//     answer: {type: String, required: true},
//     isCorrect: {type: Boolean, required: true},
//     points: {type: Number, required: true}
// });


// const Exam = mongoose.model('Exam', ExamSchema);

// export default Exam;

const MockExamSchema = new mongoose.Schema({
    title: String,
    subject_id: mongoose.Schema.Types.ObjectId,
    question_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    createdAt: { type: Date, default: Date.now }
  });

  
  const MockExam = mongoose.model('MockExam', MockExamSchema);

  export default MockExam;