import User from '../models/User.js';
import Company from '../models/Company.js';
import Student from '../models/Student.js';
import Internship from '../models/Internship.js';
import Application from '../models/Application.js';
import { createNotification } from '../utils/notificationHelper.js';

// @desc    Get dashboard overview stats
// @route   GET /api/admin/overview
// @access  Private/Admin
export const getOverviewStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalCompanies = await Company.countDocuments();
        const totalInternships = await Internship.countDocuments();
        const pendingCompanies = await Company.countDocuments({ verificationStatus: 'pending' });
        const pendingStudents = await User.countDocuments({ role: 'student', isVerified: false });

        const recentStudents = await User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(5);
        const recentCompanies = await Company.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            totalStudents,
            totalCompanies,
            totalInternships,
            pendingCompanies,
            pendingStudents,
            recentStudents,
            recentCompanies
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get companies for verification
// @route   GET /api/admin/companies/verify
// @access  Private/Admin
export const getCompaniesForVerification = async (req, res) => {
    try {
        const companies = await Company.find().populate('userId', 'name email');
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify/Approve company
// @route   PUT /api/admin/companies/verify/:id
// @access  Private/Admin
export const verifyCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        const { verificationStatus } = req.body;
        company.verificationStatus = verificationStatus;
        
        // If approved, set isApproved to true so they can post
        if (verificationStatus === 'approved') {
            company.isApproved = true;
            company.verified = true;
            // Also verify the user account
            await User.findByIdAndUpdate(company.userId, { isVerified: true });
        } else {
            company.isApproved = false;
            company.verified = false;
        }

        await company.save();

        // Notify company
        await createNotification(
            company.userId, 
            'company', 
            `Your company verification status has been updated to: ${verificationStatus}`, 
            'verification'
        );

        res.json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user status (block/verify)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive, isVerified } = req.body;

        const updateData = {};
        if (isActive !== undefined) updateData.isActive = isActive;
        if (isVerified !== undefined) updateData.isVerified = isVerified;

        const user = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Update User Status Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all internships
// @route   GET /api/admin/internships
// @access  Private/Admin
export const getAllInternships = async (req, res) => {
    try {
        const internships = await Internship.find().populate('companyId', 'companyName');
        res.json(internships);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update internship status
// @route   PUT /api/admin/internships/:id/status
// @access  Private/Admin
export const updateInternshipStatus = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship) return res.status(404).json({ message: 'Internship not found' });

        internship.status = req.body.status;
        await internship.save();
        res.json(internship);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete internship
// @route   DELETE /api/admin/internships/:id
// @access  Private/Admin
export const deleteInternship = async (req, res) => {
    try {
        await Internship.findByIdAndDelete(req.params.id);
        res.json({ message: 'Internship deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await Student.countDocuments();
        const totalCompanies = await Company.countDocuments();
        const totalInternships = await Internship.countDocuments();
        const totalApplications = await Application.countDocuments();

        // Application status distribution
        const appStats = await Application.aggregate([
            { $group: { _id: '$status', value: { $sum: 1 } } },
            { $project: { name: '$_id', value: 1, _id: 0 } }
        ]);

        // Internship status distribution
        const internStats = await Internship.aggregate([
            { $group: { _id: '$status', value: { $sum: 1 } } },
            { $project: { name: '$_id', value: 1, _id: 0 } }
        ]);

        // Monthly registrations (last 6 months)
        const monthlyRegistrations = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
                }
            },
            {
                $group: {
                    _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
                    users: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]).then(data => data.map(d => ({
            name: new Date(d._id.year, d._id.month - 1).toLocaleString('default', { month: 'short' }),
            users: d.users
        })));

        res.json({
            totalUsers,
            totalStudents,
            totalCompanies,
            totalInternships,
            totalApplications,
            appStats,
            internStats,
            monthlyRegistrations
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
