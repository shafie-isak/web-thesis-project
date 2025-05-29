import mongoose from "mongoose";

const MockExamSchema = new mongoose.Schema({
  title: String,
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  subject_name: String,
  question_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  timeLimit: Number, // in minutes
  createdAt: { type: Date, default: Date.now }
});


  
  const MockExam = mongoose.model('MockExam', MockExamSchema);

  export default MockExam;