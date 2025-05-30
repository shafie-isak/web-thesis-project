import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },       // e.g., "User", "Quiz", "Challenge"
  action: { type: String, required: true },     // e.g., "Login", "Created", "Updated"
  metadata: {
    description: String,                        // Any context text                                  // Logged from request
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('UserActivity', userActivitySchema);
