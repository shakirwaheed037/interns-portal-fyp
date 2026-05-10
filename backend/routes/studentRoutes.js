import express from 'express';
import { updateStudentProfile, applyForInternship, getMyApplications } from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.put('/profile', protect, restrictTo('student'), updateStudentProfile);
router.post('/apply/:internshipId', protect, restrictTo('student'), applyForInternship);
router.get('/applications', protect, restrictTo('student'), getMyApplications);

export default router;
