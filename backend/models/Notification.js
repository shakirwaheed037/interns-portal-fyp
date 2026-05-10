import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['admin', 'company', 'student'], required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['registration', 'application', 'approval', 'verification'], required: true },
    isRead: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
