const db = require("../config/db");

// Lấy tất cả tòa nhà
const getAllBuildings = async () => {
    const [rows] = await db.query(
        "SELECT * FROM ToaNha ORDER BY MaToaNha DESC"
    );
    return rows;
};

// Thêm tòa nhà
const createBuilding = async (TenToaNha, DiaChi, MoTa) => {
    const [result] = await db.query(
        `INSERT INTO ToaNha(TenToaNha, DiaChi, MoTa)
         VALUES (?, ?, ?)`,
        [TenToaNha, DiaChi, MoTa]
    );

    return result;
};

// Cập nhật tòa nhà
const updateBuilding = async (id, TenToaNha, DiaChi, MoTa) => {
    const [result] = await db.query(
        `UPDATE ToaNha
         SET TenToaNha=?,
             DiaChi=?,
             MoTa=?
         WHERE MaToaNha=?`,
        [TenToaNha, DiaChi, MoTa, id]
    );

    return result;
};

// Xóa tòa nhà
const deleteBuilding = async (id) => {
    const [result] = await db.query(
        "DELETE FROM ToaNha WHERE MaToaNha=?",
        [id]
    );

    return result;
};

module.exports = {
    getAllBuildings,
    createBuilding,
    updateBuilding,
    deleteBuilding
};