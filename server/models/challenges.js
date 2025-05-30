// models/Challenge.js
import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['daily', 'weekly'],
    required: true
  },
  title: String,
  description: String,
  questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  timeLimit: Number,
  type: String,
  startDate: Date,
  endDate: Date,
   participantCount: {
    type: Number,
    default: 0
  }
},{ timestamps: true });

export default mongoose.model('Challenge', ChallengeSchema);
