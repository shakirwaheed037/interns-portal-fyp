import Company from '../models/Company.js';
import Internship from '../models/Internship.js';
import Application from '../models/Application.js';
import { createNotification } from '../utils/notificationHelper.js';

// @desc    Update company profile
// @route   PUT /api/companies/profile
// @access  Private/Company
export const updateCompanyProfile = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.user._id });
        if (!company) return res.status(404).json({ message: 'Company not found' });

        if (req.body.companyName) company.companyName = req.body.companyName;
        if (req.body.industry) company.industry = req.body.industry;
        if (req.body.type) company.type = req.body.type;
        if (req.body.website) company.website = req.body.website;
        if (req.body.description) company.description = req.body.description;
        if (req.body.location) company.location = req.body.location;
        if (req.body.logo) company.logo = req.body.logo;

        const updatedCompany = await company.save();
        res.json(updatedCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Post an internship
// @route   POST /api/companies/internships
// @access  Private/Company
export const postInternship = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.user._id });
        if (!company) return res.status(404).json({ message: 'Company profile not found' });
        
        // Admin approval check
        if (!company.isApproved) {
            return res.status(403).json({
                message: "You are not approved by admin yet. You cannot post internships until approved."
            });
        }
        
        const internship = await Internship.create({
            companyId: company._id,
            title: req.body.title,
            description: req.body.description,
            skills: req.body.skills || req.body.skillsRequired,
            duration: req.body.duration,
            stipend: req.body.stipend,
            location: req.body.location || company.location,
            lastDateToApply: req.body.lastDateToApply
        });

        res.status(201).json(internship);
    } catch (error) {
        console.error('Post Internship Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get company internships
// @route   GET /api/companies/internships
// @access  Private/Company
export const getCompanyInternships = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.user._id });
        const internships = await Internship.find({ companyId: company._id });
        res.json(internships);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get internship applicants
// @route   GET /api/companies/applicants/:internshipId
// @access  Private/Company
export const getInternshipApplicants = async (req, res) => {
    try {
        const applications = await Application.find({ internshipId: req.params.internshipId })
            .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' }});
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/companies/applications/:id
// @access  Private/Company
export const updateApplicationStatus = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate({ path: 'studentId', select: 'userId' })
            .populate({ path: 'internshipId', select: 'title' });
            
        if (!application) return res.status(404).json({ message: 'Application not found' });

        application.status = req.body.status;
        await application.save();

        // Notify student
        await createNotification(
            application.studentId.userId, 
            'student', 
            `Your application for "${application.internshipId.title}" has been ${req.body.status}.`, 
            'application'
        );

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all verified companies
// @route   GET /api/companies
// @access  Public
export const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find({ verificationStatus: 'approved' }).populate('userId', 'email name');
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
