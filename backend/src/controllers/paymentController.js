const db = require('../config/db');

exports.list = async (req, res) => {
    try {
        const params = [];
        let where = '';
        if (req.user.role === 'NguoiThue') { where = 'WHERE nt.MaTaiKhoan=?'; params.push(req.user.id); }
        const [rows] = await db.query(`SELECT hdtt.*, ch.TenCanHo, DATE_FORMAT(hdtt.KyThanhToan, '%Y-%m-%d') KyThanhToan, DATE_FORMAT(hdtt.HanThanhToan, '%Y-%m-%d') HanThanhToan, DATE_FORMAT(hdtt.NgayThanhToan, '%Y-%m-%d') NgayThanhToan FROM HoaDonThanhToan hdtt JOIN HopDong hd ON hd.MaHopDong=hdtt.MaHopDong JOIN NguoiThue nt ON nt.MaNguoiThue=hd.MaNguoiThue JOIN CanHo ch ON ch.MaCanHo=hd.MaCanHo ${where} ORDER BY hdtt.KyThanhToan DESC`, params);
        res.json(rows);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.create = async (req, res) => {
    const { contractId, period, amount, dueDate, note } = req.body;
    if (!contractId || !period || !amount || !dueDate) return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin hóa đơn.' });
    try { const [result] = await db.query('INSERT INTO HoaDonThanhToan (MaHopDong, KyThanhToan, SoTien, HanThanhToan, GhiChu) VALUES (?, ?, ?, ?, ?)', [contractId, period, amount, dueDate, note || null]); res.status(201).json({ MaHoaDon: result.insertId }); }
    catch (error) { res.status(error.code === 'ER_DUP_ENTRY' ? 409 : 500).json({ message: error.code === 'ER_DUP_ENTRY' ? 'Hóa đơn của kỳ này đã tồn tại.' : error.message }); }
};

exports.markPaid = async (req, res) => {
    await db.query("UPDATE HoaDonThanhToan SET TrangThai='DaThanhToan', NgayThanhToan=COALESCE(?, CURDATE()) WHERE MaHoaDon=?", [req.body.paymentDate || null, req.params.id]);
    res.json({ message: 'Đã xác nhận thanh toán.' });
};
