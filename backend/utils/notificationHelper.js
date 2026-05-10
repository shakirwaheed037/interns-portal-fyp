import Notification from '../models/Notification.js';

export const createNotification = async (userId, role, message, type = 'verification') => {
    try {
        await Notification.create({
            userId,
            role,
            message,
            type
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};
