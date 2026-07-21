const db = require("../config/db");

// Lấy toàn bộ hợp đồng
const getAllContracts = async () => {
    const [rows] = await db.query(`
        SELECT
            hd.*,
            nt.HoTen,
            nt.CCCD,
            ch.TenCanHo
        FROM HopDong hd
        JOIN NguoiThue nt
            ON hd.MaNguoiThue = nt.MaNguoiThue
        JOIN CanHo ch
            ON hd.MaCanHo = ch.MaCanHo
        ORDER BY hd.MaHopDong DESC
    `);

    return rows;
};

// Hợp đồng hết hạn trong 30 ngày
const getExpiringContracts = async () => {
    const [rows] = await db.query(`
        SELECT
            hd.*,
            nt.HoTen,
            nt.SoDienThoai,
            ch.TenCanHo
        FROM HopDong hd
        JOIN NguoiThue nt
            ON hd.MaNguoiThue = nt.MaNguoiThue
        JOIN CanHo ch
            ON hd.MaCanHo = ch.MaCanHo
        WHERE hd.TrangThai = 'HieuLuc'
          AND hd.NgayKetThuc BETWEEN CURDATE()
          AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        ORDER BY hd.NgayKetThuc ASC
    `);

    return rows;
};

const tenantExists = async (id) => {
    const [rows] = await db.query(
        "SELECT 1 FROM NguoiThue WHERE MaNguoiThue = ? LIMIT 1",
        [id]
    );

    return rows.length > 0;
};

const apartmentExists = async (id) => {
    const [rows] = await db.query(
        "SELECT 1 FROM CanHo WHERE MaCanHo = ? LIMIT 1",
        [id]
    );

    return rows.length > 0;
};

const contractExists = async (id) => {
    const [rows] = await db.query(
        "SELECT 1 FROM HopDong WHERE MaHopDong = ? LIMIT 1",
        [id]
    );

    return rows.length > 0;
};

// Kiểm tra căn hộ có hợp đồng hiệu lực bị trùng thời gian
const hasOverlappingContract = async (
    MaCanHo,
    NgayBatDau,
    NgayKetThuc,
    excludedContractId = null
) => {
    let sql = `
        SELECT MaHopDong
        FROM HopDong
        WHERE MaCanHo = ?
          AND TrangThai = 'HieuLuc'
          AND NgayBatDau <= ?
          AND NgayKetThuc >= ?
    `;

    const params = [MaCanHo, NgayKetThuc, NgayBatDau];

    if (excludedContractId !== null) {
        sql += " AND MaHopDong <> ?";
        params.push(excludedContractId);
    }

    sql += " LIMIT 1";

    const [rows] = await db.query(sql, params);
    return rows.length > 0;
};

// Tạo hợp đồng
const createContract = async (contract) => {
    const [result] = await db.query(
        `INSERT INTO HopDong
        (
            MaNguoiThue,
            MaCanHo,
            NgayBatDau,
            NgayKetThuc,
            GiaThue,
            TienCoc,
            TrangThai,
            GhiChu
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            contract.MaNguoiThue,
            contract.MaCanHo,
            contract.NgayBatDau,
            contract.NgayKetThuc,
            contract.GiaThue,
            contract.TienCoc,
            contract.TrangThai,
            contract.GhiChu
        ]
    );

    return result;
};

// Cập nhật hợp đồng
const updateContract = async (id, contract) => {
    const [result] = await db.query(
        `UPDATE HopDong
        SET MaNguoiThue = ?,
            MaCanHo = ?,
            NgayBatDau = ?,
            NgayKetThuc = ?,
            GiaThue = ?,
            TienCoc = ?,
            TrangThai = ?,
            GhiChu = ?
        WHERE MaHopDong = ?`,
        [
            contract.MaNguoiThue,
            contract.MaCanHo,
            contract.NgayBatDau,
            contract.NgayKetThuc,
            contract.GiaThue,
            contract.TienCoc,
            contract.TrangThai,
            contract.GhiChu,
            id
        ]
    );

    return result;
};

// Xóa hợp đồng
const deleteContract = async (id) => {
    const [result] = await db.query(
        "DELETE FROM HopDong WHERE MaHopDong = ?",
        [id]
    );

    return result;
};

module.exports = {
    getAllContracts,
    getExpiringContracts,
    tenantExists,
    apartmentExists,
    contractExists,
    hasOverlappingContract,
    createContract,
    updateContract,
    deleteContract
};