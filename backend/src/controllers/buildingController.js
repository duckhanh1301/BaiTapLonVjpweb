const buildingModel = require("../models/buildingModel");

// GET
const getAllBuildings = async (req, res) => {
    try {

        const buildings = await buildingModel.getAllBuildings();

        res.status(200).json(buildings);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};

// POST
const createBuilding = async (req, res) => {

    try {

        const { TenToaNha, DiaChi, MoTa } = req.body;

        if (!TenToaNha || !DiaChi) {

            return res.status(400).json({
                message: "Thiếu thông tin"
            });

        }

        await buildingModel.createBuilding(
            TenToaNha,
            DiaChi,
            MoTa
        );

        res.status(201).json({
            message: "Thêm tòa nhà thành công"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// PUT
const updateBuilding = async (req, res) => {

    try {

        const id = req.params.id;

        const {
            TenToaNha,
            DiaChi,
            MoTa
        } = req.body;

        await buildingModel.updateBuilding(
            id,
            TenToaNha,
            DiaChi,
            MoTa
        );

        res.json({
            message: "Cập nhật thành công"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// DELETE
const deleteBuilding = async (req, res) => {

    try {

        const id = req.params.id;

        await buildingModel.deleteBuilding(id);

        res.json({
            message: "Xóa thành công"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

module.exports = {
    getAllBuildings,
    createBuilding,
    updateBuilding,
    deleteBuilding
};