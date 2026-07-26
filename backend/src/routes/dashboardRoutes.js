
const express = require('express');
const {
    getSummary,
    getRevenueByMonth,
    getApartmentStatus,
    getRevenueByBuilding
} = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

// Tất cả API dashboard chỉ dành cho chủ thuê
router.get('/summary', authMiddleware, authorizeRoles('ChuThue'), getSummary);
router.get('/revenue-by-month', authMiddleware, authorizeRoles('ChuThue'), getRevenueByMonth);
router.get('/apartment-status', authMiddleware, authorizeRoles('ChuThue'), getApartmentStatus);
router.get('/revenue-by-building', authMiddleware, authorizeRoles('ChuThue'), getRevenueByBuilding);

module.exports = router;
