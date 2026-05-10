import mongoose from 'mongoose';

const studentSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    university: { type: String, required: true },
    program: { type: String, required: true },
    enrollmentNumber: { type: String, required: true },
    semester: { type: String, required: true },
    skills: [{ type: String }],
    resume: { type: String },
}, {
    timestamps: true,
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
