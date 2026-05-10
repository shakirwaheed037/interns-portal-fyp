import express from 'express';
import { 
    updateCompanyProfile, 
    postInternship, 
    getCompanyInternships, 
    getInternshipApplicants, 
    updateApplicationStatus,
    getCompanies
} from '../controllers/companyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getCompanies); // Public route
router.put('/profile', protect, restrictTo('company'), updateCompanyProfile);
router.post('/internships', protect, restrictTo('company'), postInternship);
router.get('/internships', protect, restrictTo('company'), getCompanyInternships);
router.get('/applicants/:internshipId', protect, restrictTo('company'), getInternshipApplicants);
router.put('/applications/:id', protect, restrictTo('company'), updateApplicationStatus);

export default router;
