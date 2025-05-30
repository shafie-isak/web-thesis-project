import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },       // e.g., "User", "Quiz", "Challenge"
  action: { type: String, required: true },     // e.g., "Login", "Created", "Updated"
  metadata: {
    label: String,                              // e.g., "Posts", "Quiz 1", "Level 3"
    description: String,                        // Any context text
    ip: String                                  // Logged from request
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('UserActivity', userActivitySchema);
