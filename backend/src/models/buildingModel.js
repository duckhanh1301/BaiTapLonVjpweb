const db = require("../config/db");

// Lấy tất cả tòa nhà
const getAllBuildings = async () => {
    const [rows] = await db.query(
        "SELECT * FROM ToaNha ORDER BY MaToaNha DESC"
    );
    return rows;
};

// Lấy 1 tòa nhà theo ID
const getBuildingById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM ToaNha WHERE MaToaNha = ?",
        [id]
    );

    return rows[0];
};

// Thêm tòa nhà
const createBuilding = async (TenToaNha, DiaChi, MoTa) => {
    const [result] = await db.query(
        `INSERT INTO ToaNha (TenToaNha, DiaChi, MoTa)
         VALUES (?, ?, ?)`,
        [TenToaNha, DiaChi, MoTa]
    );

    return result;
};

// Cập nhật tòa nhà
const updateBuilding = async (id, TenToaNha, DiaChi, MoTa) => {
    const [result] = await db.query(
        `UPDATE ToaNha
         SET
            TenToaNha = ?,
            DiaChi = ?,
            MoTa = ?
         WHERE MaToaNha = ?`,
        [TenToaNha, DiaChi, MoTa, id]
    );

    return result;
};

// Xóa tòa nhà
const deleteBuilding = async (id) => {
    const [result] = await db.query(
        "DELETE FROM ToaNha WHERE MaToaNha = ?",
        [id]
    );

    return result;
};

// Tìm kiếm tòa nhà
const searchBuildings = async (keyword) => {
    const [rows] = await db.query(
        `SELECT *
         FROM ToaNha
         WHERE TenToaNha LIKE ?
            OR DiaChi LIKE ?
         ORDER BY MaToaNha DESC`,
        [
            `%${keyword}%`,
            `%${keyword}%`
        ]
    );

    return rows;
};

module.exports = {
    getAllBuildings,
    getBuildingById,
    createBuilding,
    updateBuilding,
    deleteBuilding,
    searchBuildings
};