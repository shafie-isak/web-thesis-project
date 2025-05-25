import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  questions: [
    {
      questionText: String,
      options: [String],
      correctAnswer: String,
      selectedAnswer: String,
    }
  ],
  score: Number,
  total: Number,
  timeTaken: Number,
  date: { type: Date, default: Date.now }
});

const Quiz = mongoose.model('Quiz', QuizSchema);
export default Quiz;
