const buildingModel = require("../models/buildingModel");

// Lấy tất cả tòa nhà
const getAllBuildings = async (req, res) => {
    try {
        const data = await buildingModel.getAllBuildings();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({
            message: "Lỗi lấy danh sách tòa nhà",
            error: err.message
        });
    }
};

// Thêm tòa nhà
const createBuilding = async (req, res) => {
    try {
        const { TenToaNha, DiaChi, MoTa } = req.body;

        if (!TenToaNha || !DiaChi) {
            return res.status(400).json({
                message: "Thiếu thông tin"
            });
        }

        await buildingModel.createBuilding(TenToaNha, DiaChi, MoTa);

        res.status(201).json({
            message: "Thêm tòa nhà thành công"
        });

    } catch (err) {
        res.status(500).json({
            message: "Lỗi thêm tòa nhà",
            error: err.message
        });
    }
};

// Cập nhật tòa nhà
const updateBuilding = async (req, res) => {
    try {
        const { id } = req.params;
        const { TenToaNha, DiaChi, MoTa } = req.body;

        if (!TenToaNha || !DiaChi) {
            return res.status(400).json({
                message: "Thiếu thông tin"
            });
        }

        const result = await buildingModel.updateBuilding(
            id,
            TenToaNha,
            DiaChi,
            MoTa
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Không tìm thấy tòa nhà"
            });
        }

        res.status(200).json({
            message: "Cập nhật thành công"
        });

    } catch (err) {
        res.status(500).json({
            message: "Lỗi cập nhật tòa nhà",
            error: err.message
        });
    }
};

// Xóa tòa nhà
const deleteBuilding = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await buildingModel.deleteBuilding(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Không tìm thấy tòa nhà"
            });
        }

        res.status(200).json({
            message: "Xóa thành công"
        });

    } catch (err) {
        res.status(500).json({
            message: "Lỗi xóa tòa nhà",
            error: err.message
        });
    }
};

module.exports = {
    getAllBuildings,
    createBuilding,
    updateBuilding,
    deleteBuilding
};