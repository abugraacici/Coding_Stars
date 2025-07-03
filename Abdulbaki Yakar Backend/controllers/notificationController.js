const Notification = require('../models/Notification');
const UserNotification = require('../models/UserNotification');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: notifications });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Bildirimler alınamadı',
        });
    }
};

exports.createNotification = async (req, res) => {
    const { title, message } = req.body;

    if (!title || !message) {
        return res
            .status(400)
            .json({ success: false, error: 'Başlık ve mesaj gereklidir.' });
    }

    try {
        const notification = await Notification.create({ title, message });
        res.status(201).json({ success: true, data: notification });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Bildirim oluşturulamadı.',
        });
    }
};

exports.getNotificationById = async (req, res) => {
    const { id } = req.params;

    try {
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                error: 'Bildirim bulunamadı.',
            });
        }

        res.status(200).json({
            success: true,
            data: notification,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Bildirim getirilirken hata oluştu.',
        });
    }
};

exports.checkAndSendNotification = async (req, res) => {
    const userId = req.userId;

    try {
        const lastUserNotification = await UserNotification.findOne({
            userId,
        }).sort({ sentAt: -1 });

        const now = new Date();
        let shouldSendNew = false;

        if (!lastUserNotification) {
            shouldSendNew = true;
        } else {
            const diffMs = now - lastUserNotification.sentAt;
            const diffHours = diffMs / (1000 * 60 * 60);
            if (diffHours >= 24) {
                shouldSendNew = true;
            }
        }

        if (shouldSendNew) {
            const sentNotificationIds = await UserNotification.find({
                userId,
            }).distinct('notificationId');

            let unseenNotifications = await Notification.find({
                _id: { $nin: sentNotificationIds },
            });

            if (unseenNotifications.length === 0) {
                unseenNotifications = await Notification.find();
            }

            const randomIndex = Math.floor(
                Math.random() * unseenNotifications.length
            );
            const selectedNotification = unseenNotifications[randomIndex];

            const userNotification = await UserNotification.create({
                userId,
                notificationId: selectedNotification._id,
                sentAt: now,
            });

            return res.status(200).json({
                success: true,
                isNewNotificationSended: true,
                notification: selectedNotification,
                message: 'Yeni bildirim gönderildi',
            });
        } else {
            return res.status(200).json({
                success: true,
                isNewNotificationSended: false,
                message: 'Henüz yeni bildirim zamanı değil',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Bildirim kontrolü sırasında hata oluştu',
        });
    }
};

exports.getUserNotifications = async (req, res) => {
    const userId = req.userId;

    try {
        const userNotifications = await UserNotification.find({ userId })
            .populate('notificationId')
            .sort({ sentAt: -1 });

        const notifications = userNotifications.map((un) => ({
            id: un.notificationId._id,
            title: un.notificationId.title,
            message: un.notificationId.message,
            sentAt: un.sentAt,
        }));

        res.status(200).json({ success: true, data: notifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Kullanıcı bildirimleri alınamadı.',
        });
    }
};
