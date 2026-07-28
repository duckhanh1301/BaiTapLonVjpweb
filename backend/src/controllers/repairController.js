const db = require('../config/db');

const tenantIdForAccount = async (accountId) => {
    const [rows] = await db.query('SELECT MaNguoiThue FROM NguoiThue WHERE MaTaiKhoan = ? LIMIT 1', [accountId]);
    return rows[0]?.MaNguoiThue;
};

exports.list = async (req, res) => {
    try {
        const params = [];
        let where = '';
        if (req.user.role === 'NguoiThue') {
            const tenantId = await tenantIdForAccount(req.user.id);
            if (!tenantId) return res.json([]);
            where = 'WHERE yc.MaNguoiThue = ?'; params.push(tenantId);
        }
        const [rows] = await db.query(`SELECT yc.*, nt.HoTen, ch.TenCanHo FROM YeuCauSuaChua yc JOIN NguoiThue nt ON nt.MaNguoiThue=yc.MaNguoiThue LEFT JOIN HopDong hd ON hd.MaHopDong=yc.MaHopDong LEFT JOIN CanHo ch ON ch.MaCanHo=hd.MaCanHo ${where} ORDER BY yc.NgayTao DESC`, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.code === 'ER_NO_SUCH_TABLE' ? 'Chưa tạo bảng yêu cầu sửa chữa. Hãy chạy migration 20260728_tenant_repairs_payments.sql.' : error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { repairType, description, urgentLevel = 'BinhThuong' } = req.body;
        const validPriority = ['BinhThuong', 'KhanCap', 'RatKhanCap'];
        if (!repairType?.trim() || !description?.trim() || !validPriority.includes(urgentLevel)) return res.status(400).json({ message: 'Thông tin yêu cầu không hợp lệ.' });
        const tenantId = await tenantIdForAccount(req.user.id);
        if (!tenantId) return res.status(400).json({ message: 'Chưa có hồ sơ người thuê.' });
        const [contracts] = await db.query(`SELECT MaHopDong FROM HopDong WHERE MaNguoiThue=? AND TrangThai='HieuLuc' AND CURDATE() BETWEEN NgayBatDau AND NgayKetThuc ORDER BY MaHopDong DESC LIMIT 1`, [tenantId]);
        const [result] = await db.query('INSERT INTO YeuCauSuaChua (MaNguoiThue, MaHopDong, LoaiSuCo, MoTa, MucDoUuTien) VALUES (?, ?, ?, ?, ?)', [tenantId, contracts[0]?.MaHopDong || null, repairType.trim(), description.trim(), urgentLevel]);
        res.status(201).json({ MaYeuCau: result.insertId, message: 'Đã gửi yêu cầu sửa chữa.' });
    } catch (error) {
        res.status(500).json({ message: error.code === 'ER_NO_SUCH_TABLE' ? 'Chưa tạo bảng yêu cầu sửa chữa. Hãy chạy migration 20260728_tenant_repairs_payments.sql.' : error.message });
    }
};

exports.updateStatus = async (req, res) => {
    const statuses = ['ChoXuLy', 'DangXuLy', 'HoanThanh', 'TuChoi'];
    if (!statuses.includes(req.body.status)) return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
    await db.query('UPDATE YeuCauSuaChua SET TrangThai=?, GhiChuXuLy=? WHERE MaYeuCau=?', [req.body.status, req.body.note?.trim() || null, req.params.id]);
    res.json({ message: 'Đã cập nhật yêu cầu.' });
};
