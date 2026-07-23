const db = require("../config/db");

// Lấy tất cả ảnh của một căn hộ
const getImagesByApartment = async (maCanHo) => {
    const [rows] = await db.query(
        `SELECT *
         FROM AnhCanHo
         WHERE MaCanHo = ?
         ORDER BY NgayTaiLen DESC`,
        [maCanHo]
    );

    return rows;
};

// Thêm ảnh
const createImage = async (maCanHo, duongDanAnh) => {
    const [result] = await db.query(
        `INSERT INTO AnhCanHo (MaCanHo, DuongDanAnh)
         VALUES (?, ?)`,
        [maCanHo, duongDanAnh]
    );

    return result;
};

// Lấy thông tin một ảnh
const getImageById = async (maAnh) => {
    const [rows] = await db.query(
        `SELECT *
         FROM AnhCanHo
         WHERE MaAnh = ?`,
        [maAnh]
    );

    return rows[0];
};

// Xóa ảnh
const deleteImage = async (maAnh) => {
    const [result] = await db.query(
        `DELETE FROM AnhCanHo
         WHERE MaAnh = ?`,
        [maAnh]
    );

    return result;
};

module.exports = {
    getImagesByApartment,
    createImage,
    getImageById,
    deleteImage
};