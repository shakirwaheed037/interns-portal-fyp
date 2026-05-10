import mongoose from 'mongoose';

const internshipSchema = mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: [{ type: String }],
    duration: { type: String, required: true }, // e.g. "1 month", "3 months"
    stipend: { type: String, required: true },
    location: { type: String },
    status: { type: String, enum: ['active', 'suspended', 'closed'], default: 'active' },
    lastDateToApply: { type: Date },
}, {
    timestamps: true,
});

const Internship = mongoose.model('Internship', internshipSchema);
export default Internship;
