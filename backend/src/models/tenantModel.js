const db = require("../config/db");

const getAllTenants = async (accountId = null) => {
    let sql = `
        SELECT
            nt.*,
            tk.email AS EmailTaiKhoan
        FROM NguoiThue nt
        LEFT JOIN TaiKhoan tk
            ON nt.MaTaiKhoan = tk.id
    `;
    const params = [];

    if (accountId !== null) {
        sql += " WHERE nt.MaTaiKhoan = ?";
        params.push(accountId);
    }

    sql += " ORDER BY nt.MaNguoiThue DESC";

    const [rows] = await db.query(sql, params);
    return rows;
};

const getTenantById = async (id) => {
    const [rows] = await db.query(
        `SELECT *
         FROM NguoiThue
         WHERE MaNguoiThue = ?
         LIMIT 1`,
        [id]
    );

    return rows[0] || null;
};

const tenantAccountExists = async (id) => {
    const [rows] = await db.query(
        `SELECT 1
         FROM TaiKhoan
         WHERE id = ?
           AND role = 'NhanVien'
         LIMIT 1`,
        [id]
    );

    return rows.length > 0;
};

const accountAlreadyLinked = async (accountId, excludedTenantId = null) => {
    let sql = `
        SELECT 1
        FROM NguoiThue
        WHERE MaTaiKhoan = ?
    `;
    const params = [accountId];

    if (excludedTenantId !== null) {
        sql += " AND MaNguoiThue <> ?";
        params.push(excludedTenantId);
    }

    sql += " LIMIT 1";

    const [rows] = await db.query(sql, params);
    return rows.length > 0;
};

const createTenant = async (tenant) => {
    const [result] = await db.query(
        `INSERT INTO NguoiThue
        (
            MaTaiKhoan,
            HoTen,
            SoDienThoai,
            Email,
            CCCD,
            NgaySinh,
            DiaChi
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            tenant.MaTaiKhoan,
            tenant.HoTen,
            tenant.SoDienThoai,
            tenant.Email,
            tenant.CCCD,
            tenant.NgaySinh,
            tenant.DiaChi
        ]
    );

    return result;
};

const updateTenant = async (id, tenant) => {
    const [result] = await db.query(
        `UPDATE NguoiThue
        SET MaTaiKhoan = ?,
            HoTen = ?,
            SoDienThoai = ?,
            Email = ?,
            CCCD = ?,
            NgaySinh = ?,
            DiaChi = ?
        WHERE MaNguoiThue = ?`,
        [
            tenant.MaTaiKhoan,
            tenant.HoTen,
            tenant.SoDienThoai,
            tenant.Email,
            tenant.CCCD,
            tenant.NgaySinh,
            tenant.DiaChi,
            id
        ]
    );

    return result;
};

const deleteTenant = async (id) => {
    const [result] = await db.query(
        "DELETE FROM NguoiThue WHERE MaNguoiThue = ?",
        [id]
    );

    return result;
};

module.exports = {
    getAllTenants,
    getTenantById,
    tenantAccountExists,
    accountAlreadyLinked,
    createTenant,
    updateTenant,
    deleteTenant
};
