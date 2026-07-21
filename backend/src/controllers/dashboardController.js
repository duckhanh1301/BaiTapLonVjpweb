const db = require('../config/db');

// API tổng quan
exports.getSummary = async (req, res) => {
    try {
        // Tổng số tòa nhà
        const [buildings] = await db.query('SELECT COUNT(*) as total FROM ToaNha');
        // Tổng số căn hộ
        const [apartments] = await db.query('SELECT COUNT(*) as total FROM CanHo');
        // Số căn hộ đang thuê
        const [rented] = await db.query('SELECT COUNT(*) as total FROM CanHo WHERE TrangThai = "DangThue"');
        // Số căn hộ trống
        const [empty] = await db.query('SELECT COUNT(*) as total FROM CanHo WHERE TrangThai = "Trong"');
        // Doanh thu tháng hiện tại (tính từ HopDong)
        const [revenueMonth] = await db.query(`
            SELECT SUM(GiaThue) as total
            FROM HopDong
            WHERE TrangThai = 'HieuLuc'
              AND CURDATE() BETWEEN NgayBatDau AND NgayKetThuc
        `);
        // Số hợp đồng sắp hết hạn (30 ngày tới)
        const [expiring] = await db.query(`
            SELECT COUNT(*) as total
            FROM HopDong
            WHERE TrangThai = 'HieuLuc'
              AND NgayKetThuc BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        `);

        res.json({
            totalBuildings: buildings[0]?.total || 0,
            totalApartments: apartments[0]?.total || 0,
            rentedApartments: rented[0]?.total || 0,
            emptyApartments: empty[0]?.total || 0,
            revenueThisMonth: revenueMonth[0]?.total || 0,
            expiringContracts: expiring[0]?.total || 0
        });
    } catch (error) {
        console.error('Lỗi dashboard summary:', error);
        res.status(500).json({ message: error.message });
    }
};
// API doanh thu theo tháng (12 tháng gần nhất)
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

// API tỷ lệ căn hộ trống/đã thuê
exports.getApartmentStatus = async (req, res) => {
    try {
        const [rented] = await db.query('SELECT COUNT(*) as count FROM CanHo WHERE TrangThai = "DangThue"');
        const [empty] = await db.query('SELECT COUNT(*) as count FROM CanHo WHERE TrangThai = "Trong"');
        res.json({
            rented: rented[0]?.count || 0,
            empty: empty[0]?.count || 0
        });
    } catch (error) {
        console.error('Lỗi apartment status:', error);
        res.status(500).json({ message: error.message });
    }
};

// API doanh thu theo tòa nhà
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