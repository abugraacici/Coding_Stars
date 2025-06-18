const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const searchController = require('../controllers/searchController');

router.get('/', verifyToken, searchController.getSearchHistory);
router.post('/', verifyToken, searchController.addSearchHistory);
router.delete('/', verifyToken, searchController.clearSearchHistory);

module.exports = router;
