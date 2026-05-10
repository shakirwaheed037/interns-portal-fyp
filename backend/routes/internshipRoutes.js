import express from 'express';
import { getInternships, getInternshipById } from '../controllers/internshipController.js';

const router = express.Router();

router.get('/', getInternships);
router.get('/:id', getInternshipById);

export default router;
