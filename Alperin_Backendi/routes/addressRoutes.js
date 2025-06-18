const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, addressController.getAddresses);
router.put('/select/:addressId', verifyToken, addressController.selectAddress);
router.put('/update', verifyToken, addressController.updateAddress);
router.post('/', verifyToken, addressController.addAddress);
router.delete('/:addressId', verifyToken, addressController.deleteAddress);

module.exports = router;
