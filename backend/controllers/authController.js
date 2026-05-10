import User from '../models/User.js';
import Student from '../models/Student.js';
import Company from '../models/Company.js';
import generateToken from '../utils/generateToken.js';
import { createNotification } from '../utils/notificationHelper.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Enforce single admin rule
        if (role === 'admin') {
            const adminExists = await User.findOne({ role: 'admin' });
            if (adminExists) {
                return res.status(400).json({ message: 'Admin already exists. Only one administrator is allowed in the system.' });
            }
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        if (user) {
            // Get Admin for notification
            const admin = await User.findOne({ role: 'admin' });

            // Create corresponding profile based on role
            if (role === 'student') {
                await Student.create({
                    userId: user._id,
                    university: req.body.university || '',
                    program: req.body.program || '',
                    enrollmentNumber: req.body.enrollmentNumber || '',
                    semester: req.body.semester || '',
                });

                if (admin) {
                    await createNotification(admin._id, 'admin', `New student registered: ${name}`, 'registration');
                }
            } else if (role === 'company') {
                await Company.create({
                    userId: user._id,
                    companyName: req.body.companyName || name,
                    industry: req.body.industry || '',
                    type: req.body.type || 'Software House',
                    registrationDocument: req.body.registrationDocument || '',
                });

                if (admin) {
                    await createNotification(admin._id, 'admin', `New company registered: ${req.body.companyName || name}`, 'registration');
                }
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                profilePic: user.profilePic,
                token: generateToken(res, user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Strict role validation
        if (role && user.role !== role) {
            return res.status(401).json({ message: `Incorrect role selected. This account is registered as a ${user.role}.` });
        }

        if (await user.matchPassword(password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                profilePic: user.profilePic,
                token: generateToken(res, user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            let profile = {};
            if (user.role === 'student') {
                profile = await Student.findOne({ userId: user._id });
            } else if (user.role === 'company') {
                profile = await Company.findOne({ userId: user._id });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                profilePic: user.profilePic,
                profile,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
