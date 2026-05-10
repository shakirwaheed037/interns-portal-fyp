import mongoose from 'mongoose';

const companySchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    industry: { type: String, required: true },
    website: { type: String },
    description: { type: String },
    location: { type: String },
    verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    registrationDocument: { type: String },
    logo: { type: String },
    type: { type: String, enum: ['University', 'Software House', 'Corporate'], default: 'Software House' },
    verified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const Company = mongoose.model('Company', companySchema);
export default Company;
