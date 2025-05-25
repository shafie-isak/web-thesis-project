// models/ChallengeResult.js
import mongoose from 'mongoose';

const ChallengeResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
  score: Number,
  total: Number,
  timeTaken: Number,
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model('ChallengeResult', ChallengeResultSchema);
