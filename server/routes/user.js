import express from 'express';
import { createUser, updateUserByAdmin, getUser, banUser, deleteUser, updateXP, getWeeklyXPSummary, unlockBadge, loginUser, getCurrentUserProfile, requestPasswordReset, updateProfilePicture, getTopUsers, sendResetOTP, verifyResetOTP, resetPasswordWithOTP } from '../controllers/user.js';
import upload from '../middleware/upload.js';
import authMiddleware, { isAdmin } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/all', authMiddleware, getUser);
router.post('/add-user', upload.single('profilePicture'), createUser);
router.put('/:id/edit', authMiddleware, isAdmin, upload.single('profilePicture'), updateUserByAdmin);
router.put('/:id/ban', authMiddleware, isAdmin, banUser);
router.delete('/:id', authMiddleware, isAdmin, deleteUser);
router.post('/update-xp', authMiddleware, updateXP);
router.get('/xp-summary/', authMiddleware, getWeeklyXPSummary);
router.post('/unlock-badge', authMiddleware, unlockBadge);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getCurrentUserProfile);
router.put('/update-profile-picture', authMiddleware, upload.single('profilePicture'), updateProfilePicture); // ✅ protected
router.post('/request-reset', requestPasswordReset);
router.get('/top', authMiddleware, isAdmin, getTopUsers);
router.post('/forgot-password/send-otp', sendResetOTP);
router.post('/forgot-password/verify-otp', verifyResetOTP);
router.post('/forgot-password/reset', resetPasswordWithOTP);

router.put('/:id/ban', authMiddleware, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'banned' },
      { new: true }
    );
    res.status(200).json({ success: true, message: "User banned", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to ban user" });
  }
});



export default router;
