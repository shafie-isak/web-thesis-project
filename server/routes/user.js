import express from 'express';
import { createUser, getUser, updateXP ,getWeeklyXPSummary, unlockBadge, loginUser, getCurrentUserProfile,requestPasswordReset, resetPassword, updateProfilePicture } from '../controllers/user.js';
import upload from '../middleware/upload.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add-user', createUser);
router.get('/get-users', authMiddleware, getUser); // ✅ protected
router.post('/update-xp',authMiddleware ,updateXP);
router.get('/xp-summary/', authMiddleware, getWeeklyXPSummary);
router.post('/unlock-badge', authMiddleware, unlockBadge);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getCurrentUserProfile);
router.put('/update-profile-picture', authMiddleware, upload.single('profilePicture'), updateProfilePicture); // ✅ protected
router.post('/request-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

export default router;
