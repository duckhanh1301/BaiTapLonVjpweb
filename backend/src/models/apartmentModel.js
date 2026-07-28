const db = require("../config/db");

// Trạng thái hiển thị được ưu tiên theo hợp đồng đang hiệu lực ở thời điểm hiện tại.
// Điều này tránh việc CanHo.TrangThai bị cũ sau khi tạo/sửa hợp đồng.
const displayedStatusSql = (apartmentAlias = "c") => `
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM HopDong hd
            WHERE hd.MaCanHo = ${apartmentAlias}.MaCanHo
              AND hd.TrangThai = 'HieuLuc'
              AND hd.NgayBatDau <= CURDATE()
              AND hd.NgayKetThuc >= CURDATE()
        ) THEN 'Đã thuê'
        WHEN ${apartmentAlias}.TrangThai = 'DaThue' THEN 'Đã thuê'
        WHEN ${apartmentAlias}.TrangThai = 'Trong' THEN 'Trống'
        ELSE ${apartmentAlias}.TrangThai
    END`;

// Lấy tất cả căn hộ
const getAllApartments = async () => {
    const [rows] = await db.query(
        `SELECT c.*, t.TenToaNha,
         ${displayedStatusSql()} AS TrangThai,
         (SELECT DuongDanAnh FROM AnhCanHo WHERE MaCanHo = c.MaCanHo ORDER BY NgayTaiLen DESC LIMIT 1) AS HinhAnh
         FROM CanHo c
         JOIN ToaNha t ON c.MaToaNha = t.MaToaNha
         ORDER BY c.MaCanHo DESC`
    );
    return rows;
};

// Lấy căn hộ theo ID
const getApartmentById = async (id) => {
    const [rows] = await db.query(
        `SELECT c.*, t.TenToaNha,
         ${displayedStatusSql()} AS TrangThai,
         (SELECT DuongDanAnh FROM AnhCanHo WHERE MaCanHo = c.MaCanHo ORDER BY NgayTaiLen DESC LIMIT 1) AS HinhAnh
         FROM CanHo c
         JOIN ToaNha t
         ON c.MaToaNha = t.MaToaNha
         WHERE c.MaCanHo = ?`,
        [id]
    );

    return rows[0];
};

// Thêm căn hộ
const createApartment = async (
    MaToaNha,
    TenCanHo,
    GiaThue,
    DienTich,
    Tang,
    SoPhongNgu,
    SoPhongTam,
    TrangThai,
    MoTa
) => {

    const [result] = await db.query(
        `INSERT INTO CanHo
        (MaToaNha, TenCanHo, GiaThue, DienTich, Tang,
        SoPhongNgu, SoPhongTam, TrangThai, MoTa)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            MaToaNha,
            TenCanHo,
            GiaThue,
            DienTich,
            Tang,
            SoPhongNgu,
            SoPhongTam,
            TrangThai,
            MoTa
        ]
    );

    return result;
};

// Cập nhật căn hộ
const updateApartment = async (
    id,
    MaToaNha,
    TenCanHo,
    GiaThue,
    DienTich,
    Tang,
    SoPhongNgu,
    SoPhongTam,
    TrangThai,
    MoTa
) => {

    const [result] = await db.query(
        `UPDATE CanHo
         SET
            MaToaNha = ?,
            TenCanHo = ?,
            GiaThue = ?,
            DienTich = ?,
            Tang = ?,
            SoPhongNgu = ?,
            SoPhongTam = ?,
            TrangThai = ?,
            MoTa = ?
         WHERE MaCanHo = ?`,
        [
            MaToaNha,
            TenCanHo,
            GiaThue,
            DienTich,
            Tang,
            SoPhongNgu,
            SoPhongTam,
            TrangThai,
            MoTa,
            id
        ]
    );

    return result;
};

// Xóa căn hộ
const deleteApartment = async (id) => {

    const [result] = await db.query(
        "DELETE FROM CanHo WHERE MaCanHo = ?",
        [id]
    );

    return result;
};

// Tìm kiếm căn hộ
const searchApartments = async (keyword) => {

    const [rows] = await db.query(
        `SELECT c.*, t.TenToaNha,
         ${displayedStatusSql()} AS TrangThai,
         (SELECT DuongDanAnh FROM AnhCanHo WHERE MaCanHo = c.MaCanHo ORDER BY NgayTaiLen DESC LIMIT 1) AS HinhAnh
         FROM CanHo c
         JOIN ToaNha t
         ON c.MaToaNha = t.MaToaNha
         WHERE c.TenCanHo LIKE ?
            OR ${displayedStatusSql()} LIKE ?
            OR t.TenToaNha LIKE ?
         ORDER BY c.MaCanHo DESC`,
        [
            `%${keyword}%`,
            `%${keyword}%`,
            `%${keyword}%`
        ]
    );

    return rows;
};

module.exports = {
    getAllApartments,
    getApartmentById,
    createApartment,
    updateApartment,
    deleteApartment,
    searchApartments
};
