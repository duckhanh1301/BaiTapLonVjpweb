
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

// Tất cả API dashboard chỉ dành cho Admin
router.get('/summary', authMiddleware, authorizeRoles('Admin'), getSummary);
router.get('/revenue-by-month', authMiddleware, authorizeRoles('Admin'), getRevenueByMonth);
router.get('/apartment-status', authMiddleware, authorizeRoles('Admin'), getApartmentStatus);
router.get('/revenue-by-building', authMiddleware, authorizeRoles('Admin'), getRevenueByBuilding);

module.exports = router;