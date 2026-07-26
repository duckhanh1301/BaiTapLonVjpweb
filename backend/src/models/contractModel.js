const db = require("../config/db");

// Lấy toàn bộ hợp đồng
const getAllContracts = async () => {
    const [rows] = await db.query(`
        SELECT
            hd.*,
            DATE_FORMAT(hd.NgayBatDau, '%Y-%m-%d') AS NgayBatDau,
            DATE_FORMAT(hd.NgayKetThuc, '%Y-%m-%d') AS NgayKetThuc,
            nt.HoTen,
            nt.CCCD,
            nt.SoDienThoai,
            nt.Email,
            ch.TenCanHo,
            ch.Tang,
            tn.TenToaNha,
            tn.DiaChi AS DiaChiToaNha
        FROM HopDong hd
        JOIN NguoiThue nt
            ON hd.MaNguoiThue = nt.MaNguoiThue
        JOIN CanHo ch
            ON hd.MaCanHo = ch.MaCanHo
        JOIN ToaNha tn
            ON ch.MaToaNha = tn.MaToaNha
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

const getContractOptions = async () => {
    const [
        [tenants],
        [accounts],
        [apartments]
    ] = await Promise.all([
        db.query(
            `SELECT
                MaNguoiThue,
                HoTen,
                SoDienThoai,
                Email
             FROM NguoiThue
             ORDER BY HoTen ASC`
        ),
        db.query(
            `SELECT
                tk.id,
                tk.email
             FROM TaiKhoan tk
             LEFT JOIN NguoiThue nt
                ON nt.MaTaiKhoan = tk.id
             WHERE tk.role = 'NguoiThue'
               AND nt.MaNguoiThue IS NULL
             ORDER BY tk.email ASC`
        ),
        db.query(
            `SELECT
                ch.MaCanHo,
                ch.TenCanHo,
                ch.GiaThue,
                ch.TrangThai,
                ch.Tang,
                tn.TenToaNha,
                tn.DiaChi AS DiaChiToaNha
             FROM CanHo ch
             JOIN ToaNha tn
                ON ch.MaToaNha = tn.MaToaNha
             ORDER BY tn.TenToaNha ASC, ch.TenCanHo ASC`
        )
    ]);

    return { tenants, accounts, apartments };
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

const createContractWithTenant = async (tenant, contract) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [accounts] = await connection.query(
            `SELECT id
             FROM TaiKhoan
             WHERE id = ?
               AND role = 'NguoiThue'
             LIMIT 1
             FOR UPDATE`,
            [tenant.MaTaiKhoan]
        );

        if (accounts.length === 0) {
            const error = new Error(
                "Tài khoản người thuê không tồn tại hoặc không hợp lệ"
            );
            error.code = "INVALID_TENANT_ACCOUNT";
            throw error;
        }

        const [linkedTenants] = await connection.query(
            `SELECT MaNguoiThue
             FROM NguoiThue
             WHERE MaTaiKhoan = ?
             LIMIT 1
             FOR UPDATE`,
            [tenant.MaTaiKhoan]
        );

        if (linkedTenants.length > 0) {
            const error = new Error(
                "Tài khoản này đã liên kết với một người thuê khác"
            );
            error.code = "TENANT_ACCOUNT_ALREADY_LINKED";
            throw error;
        }

        const [tenantResult] = await connection.query(
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

        const tenantId = tenantResult.insertId;
        const [contractResult] = await connection.query(
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
                tenantId,
                contract.MaCanHo,
                contract.NgayBatDau,
                contract.NgayKetThuc,
                contract.GiaThue,
                contract.TienCoc,
                contract.TrangThai,
                contract.GhiChu
            ]
        );

        await connection.commit();

        return {
            MaNguoiThue: tenantId,
            MaHopDong: contractResult.insertId
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
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

const getContractById = async (id) => {
    const [rows] = await db.query(
        `SELECT
            hd.*,
            nt.HoTen,
            nt.CCCD,
            nt.SoDienThoai,
            nt.Email,
            nt.NgaySinh,
            nt.DiaChi AS DiaChiNguoiThue,
            ch.TenCanHo,
            ch.DienTich,
            ch.Tang,
            tn.TenToaNha,
            tn.DiaChi AS DiaChiToaNha
        FROM HopDong hd
        JOIN NguoiThue nt
            ON hd.MaNguoiThue = nt.MaNguoiThue
        JOIN CanHo ch
            ON hd.MaCanHo = ch.MaCanHo
        JOIN ToaNha tn
            ON ch.MaToaNha = tn.MaToaNha
        WHERE hd.MaHopDong = ?`,
        [id]
    );

    return rows[0] || null;
};

module.exports = {
    getAllContracts,
    getExpiringContracts,
    getContractOptions,
    tenantExists,
    apartmentExists,
    contractExists,
    hasOverlappingContract,
    createContract,
    createContractWithTenant,
    updateContract,
    deleteContract,
    getContractById
};
