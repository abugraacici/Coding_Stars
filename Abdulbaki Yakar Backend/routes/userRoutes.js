const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.get('/me', verifyToken, userController.getUserProfile);
router.get('/account', verifyToken, userController.getFullUserData);
router.put('/update-fullname', verifyToken, userController.updateFullname);
router.put(
    '/update-phone-number',
    verifyToken,
    userController.updatePhoneNumber
);
router.put('/update-email', verifyToken, userController.updateEmail);
router.put('/update-password', verifyToken, userController.updatePassword);
router.delete('/delete-account', verifyToken, userController.deleteAccount);
router.get('/cart', verifyToken, userController.getCart);
router.post('/cart', verifyToken, userController.addOrUpdateCartItem);
router.delete('/cart/:productId', verifyToken, userController.removeCartItem);
router.get(
    '/fullname-and-phone-number',
    verifyToken,
    userController.getUserFullnameAndPhoneNumber
);

module.exports = router;
