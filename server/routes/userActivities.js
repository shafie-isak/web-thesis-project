import express from 'express';
import { getAllActivities,logActivity, getUserActivities,getActivityStats } from '../controllers/userActivityController.js';

const router = express.Router();

router.get('/all', getAllActivities);
router.post('/log', logActivity);
router.get('/:userId', getUserActivities);
router.get('/stats/daily', getActivityStats);


export default router;
