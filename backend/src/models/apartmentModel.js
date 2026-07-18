const db = require("../config/db");

// Lấy tất cả căn hộ
const getAllApartments = async () => {
    const [rows] = await db.query(
        `SELECT c.*, t.TenToaNha
         FROM CanHo c
         JOIN ToaNha t ON c.MaToaNha = t.MaToaNha
         ORDER BY c.MaCanHo DESC`
    );
    return rows;
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
        (MaToaNha,TenCanHo,GiaThue,DienTich,Tang,
        SoPhongNgu,SoPhongTam,TrangThai,MoTa)
        VALUES(?,?,?,?,?,?,?,?,?)`,
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

// Cập nhật
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
        MaToaNha=?,
        TenCanHo=?,
        GiaThue=?,
        DienTich=?,
        Tang=?,
        SoPhongNgu=?,
        SoPhongTam=?,
        TrangThai=?,
        MoTa=?
        WHERE MaCanHo=?`,
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

// Xóa
const deleteApartment = async(id)=>{

    const [result]=await db.query(
        "DELETE FROM CanHo WHERE MaCanHo=?",
        [id]
    );

    return result;

};

module.exports={
    getAllApartments,
    createApartment,
    updateApartment,
    deleteApartment
}