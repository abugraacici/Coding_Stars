const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', notificationController.getNotifications);
router.get(
    '/check',
    verifyToken,
    notificationController.checkAndSendNotification
);
router.get('/user', verifyToken, notificationController.getUserNotifications);
router.get('/:id', notificationController.getNotificationById);
router.post('/', notificationController.createNotification);

module.exports = router;
