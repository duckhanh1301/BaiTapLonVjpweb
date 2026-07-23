const apartmentModel = require("../models/apartmentModel");

// Lấy tất cả căn hộ
const getAllApartments = async (req, res) => {
    try {
        const data = await apartmentModel.getAllApartments();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Lấy căn hộ theo ID
const getApartmentById = async (req, res) => {
    try {
        const apartment = await apartmentModel.getApartmentById(req.params.id);

        if (!apartment) {
            return res.status(404).json({
                message: "Không tìm thấy căn hộ"
            });
        }

        res.status(200).json(apartment);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Thêm căn hộ
const createApartment = async (req, res) => {
    try {

        const {
            MaToaNha,
            TenCanHo,
            GiaThue,
            DienTich,
            Tang,
            SoPhongNgu,
            SoPhongTam,
            TrangThai,
            MoTa
        } = req.body;

        await apartmentModel.createApartment(
            MaToaNha,
            TenCanHo,
            GiaThue,
            DienTich,
            Tang,
            SoPhongNgu,
            SoPhongTam,
            TrangThai,
            MoTa
        );

        res.status(201).json({
            message: "Thêm căn hộ thành công"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Cập nhật căn hộ
const updateApartment = async (req, res) => {
    try {

        const id = req.params.id;

        const {
            MaToaNha,
            TenCanHo,
            GiaThue,
            DienTich,
            Tang,
            SoPhongNgu,
            SoPhongTam,
            TrangThai,
            MoTa
        } = req.body;

        const result = await apartmentModel.updateApartment(
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
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Không tìm thấy căn hộ"
            });
        }

        res.status(200).json({
            message: "Cập nhật thành công"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Xóa căn hộ
const deleteApartment = async (req, res) => {
    try {

        const result = await apartmentModel.deleteApartment(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Không tìm thấy căn hộ"
            });
        }

        res.status(200).json({
            message: "Xóa thành công"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Tìm kiếm căn hộ
const searchApartments = async (req, res) => {
    try {

        const keyword = req.query.keyword || "";

        const data = await apartmentModel.searchApartments(keyword);

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {
    getAllApartments,
    getApartmentById,
    createApartment,
    updateApartment,
    deleteApartment,
    searchApartments
};