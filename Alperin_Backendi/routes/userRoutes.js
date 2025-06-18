const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.get('/me', verifyToken, userController.getUserProfile);
router.get('/account', verifyToken, userController.getFullUserData);
router.get('/cart', verifyToken, userController.getCart);
router.post('/cart', verifyToken, userController.addOrUpdateCartItem);
router.delete('/cart/:productId', verifyToken, userController.removeCartItem);
router.get('/favorites', verifyToken, userController.getFavorites);
router.post(
    '/favorites/:productId',
    verifyToken,
    userController.addToFavorites
);
router.delete(
    '/favorites/:productId',
    verifyToken,
    userController.removeFromFavorites
);

module.exports = router;
