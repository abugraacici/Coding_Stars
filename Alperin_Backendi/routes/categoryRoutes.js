const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getAllCategories);
router.get('/:id/name', categoryController.getCategoryNameById);
router.post('/', categoryController.createCategory);
router.put('/update', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
