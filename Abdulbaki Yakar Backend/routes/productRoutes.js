const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const optionalVerifyToken = require('../middleware/optionalVerifyToken');
const productController = require('../controllers/productController');

router.get('/', optionalVerifyToken, productController.getAllProducts);
router.get(
    '/seller-products',
    verifyToken,
    productController.getProductsBySeller
);
router.get('/:id', optionalVerifyToken, productController.getProductById);
router.put('/:id', verifyToken, productController.updateProduct);
router.post('/', verifyToken, productController.addProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;
