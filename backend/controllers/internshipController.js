import Internship from '../models/Internship.js';

// @desc    Get all active internships
// @route   GET /api/internships
// @access  Public
export const getInternships = async (req, res) => {
    try {
        const internships = await Internship.find({ status: 'active' }).populate('companyId', 'companyName location');
        res.json(internships);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single internship details
// @route   GET /api/internships/:id
// @access  Public
export const getInternshipById = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id).populate('companyId');
        if (!internship) return res.status(404).json({ message: 'Internship not found' });
        
        res.json(internship);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
