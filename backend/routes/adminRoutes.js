import express from 'express';
import { 
    getOverviewStats, 
    getCompaniesForVerification, 
    verifyCompany, 
    getUsers, 
    updateUserStatus,
    getAllInternships, 
    updateInternshipStatus,
    deleteInternship,
    getAnalytics
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.get('/overview', getOverviewStats);
router.get('/companies/verify', getCompaniesForVerification);
router.put('/companies/verify/:id', verifyCompany);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/internships', getAllInternships);
router.put('/internships/:id/status', updateInternshipStatus);
router.delete('/internships/:id', deleteInternship);
router.get('/analytics', getAnalytics);

export default router;
