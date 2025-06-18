const express = require('express');
const router = express.Router();
const optionalVerifyToken = require('../middleware/optionalVerifyToken');
const productController = require('../controllers/productController');

router.get('/', optionalVerifyToken, productController.getAllProducts);
router.get('/:id', optionalVerifyToken, productController.getProductById);

module.exports = router;
