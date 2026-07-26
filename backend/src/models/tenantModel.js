const db = require("../config/db");

const getAllTenants = async (accountId = null) => {
    let sql = `
        SELECT
            nt.*,
            tk.email AS EmailTaiKhoan,
            hd.MaHopDong,
            hd.TrangThai AS TrangThaiHopDong,
            ch.MaCanHo,
            ch.TenCanHo,
            tn.MaToaNha,
            tn.TenToaNha,
            tn.DiaChi AS DiaChiToaNha
        FROM NguoiThue nt
        LEFT JOIN TaiKhoan tk
            ON nt.MaTaiKhoan = tk.id
        LEFT JOIN HopDong hd
            ON hd.MaHopDong = (
                SELECT hd2.MaHopDong
                FROM HopDong hd2
                WHERE hd2.MaNguoiThue = nt.MaNguoiThue
                ORDER BY
                    (hd2.TrangThai = 'HieuLuc') DESC,
                    hd2.NgayKetThuc DESC,
                    hd2.MaHopDong DESC
                LIMIT 1
            )
        LEFT JOIN CanHo ch
            ON hd.MaCanHo = ch.MaCanHo
        LEFT JOIN ToaNha tn
            ON ch.MaToaNha = tn.MaToaNha
    `;
    const conditions = ["hd.MaHopDong IS NOT NULL"];
    const params = [];

    if (accountId !== null) {
        conditions.push("nt.MaTaiKhoan = ?");
        params.push(accountId);
    }

    sql += ` WHERE ${conditions.join(" AND ")}`;
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
           AND role = 'NguoiThue'
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

const getTenantAccounts = async () => {
    const [rows] = await db.query(
        `SELECT
            tk.id,
            tk.email,
            nt.MaNguoiThue,
            nt.HoTen
         FROM TaiKhoan tk
         LEFT JOIN NguoiThue nt
            ON nt.MaTaiKhoan = tk.id
         WHERE tk.role = 'NguoiThue'
         ORDER BY tk.email ASC`
    );

    return rows;
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
    getTenantAccounts,
    createTenant,
    updateTenant,
    deleteTenant
};
