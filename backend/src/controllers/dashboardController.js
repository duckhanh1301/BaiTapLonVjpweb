
const db = require('../config/db');

exports.getSummary = async (req, res) => {
    try {
        const [buildings] = await db.query('SELECT COUNT(*) as total FROM ToaNha');
        const [apartments] = await db.query('SELECT COUNT(*) as total FROM CanHo');
        const [rented] = await db.query(`
            SELECT COUNT(DISTINCT hd.MaCanHo) as total
            FROM HopDong hd
            WHERE hd.TrangThai = 'HieuLuc' 
              AND CURDATE() BETWEEN hd.NgayBatDau AND hd.NgayKetThuc
        `);
        const rentedCount = rented[0]?.total || 0;
        const totalApartments = apartments[0]?.total || 0;
        const emptyCount = totalApartments - rentedCount;

        const [revenueMonth] = await db.query(`
            SELECT SUM(GiaThue) as total
            FROM HopDong
            WHERE TrangThai = 'HieuLuc'
              AND CURDATE() BETWEEN NgayBatDau AND NgayKetThuc
        `);

        const [expiring] = await db.query(`
            SELECT COUNT(*) as total
            FROM HopDong
            WHERE TrangThai = 'HieuLuc'
              AND NgayKetThuc BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        `);

        res.json({
            totalBuildings: buildings[0]?.total || 0,
            totalApartments: totalApartments,
            rentedApartments: rentedCount,
            emptyApartments: emptyCount,
            revenueThisMonth: revenueMonth[0]?.total || 0,
            expiringContracts: expiring[0]?.total || 0
        });
    } catch (error) {
        console.error('Lỗi dashboard summary:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getRevenueByMonth = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT DATE_FORMAT(NgayBatDau, '%Y-%m') as month, SUM(GiaThue) as revenue
            FROM HopDong
            WHERE TrangThai = 'HieuLuc'
              AND NgayBatDau >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY month
            ORDER BY month ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Lỗi revenue by month:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getApartmentStatus = async (req, res) => {
    try {
        const [rented] = await db.query(`
            SELECT COUNT(DISTINCT MaCanHo) as count
            FROM HopDong
            WHERE TrangThai = 'HieuLuc'
              AND CURDATE() BETWEEN NgayBatDau AND NgayKetThuc
        `);
        const [total] = await db.query('SELECT COUNT(*) as count FROM CanHo');
        const rentedCount = rented[0]?.count || 0;
        const totalCount = total[0]?.count || 0;
        res.json({ rented: rentedCount, empty: totalCount - rentedCount });
    } catch (error) {
        console.error('Lỗi apartment status:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getRevenueByBuilding = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT tn.TenToaNha, SUM(hd.GiaThue) as revenue
            FROM ToaNha tn
            JOIN CanHo ch ON tn.MaToaNha = ch.MaToaNha
            JOIN HopDong hd ON ch.MaCanHo = hd.MaCanHo
            WHERE hd.TrangThai = 'HieuLuc'
              AND CURDATE() BETWEEN hd.NgayBatDau AND hd.NgayKetThuc
            GROUP BY tn.MaToaNha
        `);
        res.json(rows);
    } catch (error) {
        console.error('Lỗi revenue by building:', error);
        res.status(500).json({ message: error.message });
    }
};