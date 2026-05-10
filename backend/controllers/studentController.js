import Student from '../models/Student.js';
import User from '../models/User.js';
import Internship from '../models/Internship.js';
import Application from '../models/Application.js';
import Company from '../models/Company.js';
import { createNotification } from '../utils/notificationHelper.js';

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private/Student
export const updateStudentProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user._id });
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        // Update Student Profile
        if (req.body.university) student.university = req.body.university;
        if (req.body.program) student.program = req.body.program;
        if (req.body.enrollmentNumber) student.enrollmentNumber = req.body.enrollmentNumber;
        if (req.body.semester) student.semester = req.body.semester;
        if (req.body.skills) student.skills = req.body.skills;
        if (req.body.experience) student.experience = req.body.experience;
        if (req.body.education) student.education = req.body.education;
        if (req.body.resume) student.resume = req.body.resume;

        await student.save();

        // Update User info (name and profilePic)
        const user = await User.findById(req.user._id);
        if (req.body.name) user.name = req.body.name;
        if (req.body.profilePic) user.profilePic = req.body.profilePic;
        await user.save();

        // Return combined data
        res.json({
            ...student.toObject(),
            name: user.name,
            email: user.email,
            profilePic: user.profilePic
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Apply for an internship
// @route   POST /api/student/apply/:internshipId
// @access  Private/Student
export const applyForInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.internshipId).populate('companyId');
        if (!internship) return res.status(404).json({ message: 'Internship not found' });

        // Deadline check
        if (internship.lastDateToApply && new Date() > new Date(internship.lastDateToApply)) {
            return res.status(400).json({ message: 'Application deadline has passed' });
        }

        const student = await Student.findOne({ userId: req.user._id });
        if (!student) return res.status(404).json({ message: 'Student profile not found. Please complete your profile first.' });
        
        // Check if already applied
        const alreadyApplied = await Application.findOne({
            studentId: student._id,
            internshipId: internship._id
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied for this internship' });
        }

        const { name, email, location, qualification, resume, coverLetter } = req.body;

        if (!name || !email) {
            return res.status(400).json({ 
                message: `Application validation failed: name and email are required.`,
                debug: { receivedName: name, receivedEmail: email, body: req.body }
            });
        }

        const application = await Application.create({
            studentId: student._id,
            internshipId: internship._id,
            companyId: internship.companyId._id,
            name: String(name).trim(),
            email: String(email).trim(),
            location: location ? String(location).trim() : '',
            qualification: qualification ? String(qualification).trim() : '',
            resume: resume || student.resume || '',
            coverLetter: coverLetter || ''
        });

        // Notify company
        await createNotification(
            internship.companyId.userId, 
            'company', 
            `New application received for "${internship.title}"`, 
            'application'
        );

        // Notify student
        await createNotification(
            req.user._id, 
            'student', 
            `Successfully applied for "${internship.title}"`, 
            'application'
        );

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student applications
// @route   GET /api/student/applications
// @access  Private/Student
export const getMyApplications = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user._id });
        const applications = await Application.find({ studentId: student._id })
            .populate({
                path: 'internshipId',
                populate: { path: 'companyId', select: 'companyName logo' }
            });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
