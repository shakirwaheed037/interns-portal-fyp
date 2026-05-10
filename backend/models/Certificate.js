import mongoose from 'mongoose';

const certificateSchema = mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
    issueDate: { type: Date, default: Date.now },
    certificateFile: { type: String, required: true },
}, {
    timestamps: true,
});

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
