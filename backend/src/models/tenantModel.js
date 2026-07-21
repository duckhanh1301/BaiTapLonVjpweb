const db = require("../config/db");

// Lấy danh sách người thuê
const getAllTenants = async () => {
    const [rows] = await db.query(`
        SELECT *
        FROM NguoiThue
        ORDER BY MaNguoiThue DESC
    `);

    return rows;
};

// Thêm người thuê
const createTenant = async (
    HoTen,
    SoDienThoai,
    Email,
    CCCD,
    NgaySinh,
    DiaChi
) => {
    const [result] = await db.query(
        `INSERT INTO NguoiThue
        (HoTen, SoDienThoai, Email, CCCD, NgaySinh, DiaChi)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            HoTen,
            SoDienThoai,
            Email || null,
            CCCD,
            NgaySinh || null,
            DiaChi || null
        ]
    );

    return result;
};

// Cập nhật người thuê
const updateTenant = async (
    id,
    HoTen,
    SoDienThoai,
    Email,
    CCCD,
    NgaySinh,
    DiaChi
) => {
    const [result] = await db.query(
        `UPDATE NguoiThue
        SET HoTen = ?,
            SoDienThoai = ?,
            Email = ?,
            CCCD = ?,
            NgaySinh = ?,
            DiaChi = ?
        WHERE MaNguoiThue = ?`,
        [
            HoTen,
            SoDienThoai,
            Email || null,
            CCCD,
            NgaySinh || null,
            DiaChi || null,
            id
        ]
    );

    return result;
};

// Xóa người thuê
const deleteTenant = async (id) => {
    const [result] = await db.query(
        "DELETE FROM NguoiThue WHERE MaNguoiThue = ?",
        [id]
    );

    return result;
};

module.exports = {
    getAllTenants,
    createTenant,
    updateTenant,
    deleteTenant
};