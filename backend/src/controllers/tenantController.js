const tenantModel = require("../models/tenantModel");

const getAllTenants = async (req, res) => {
    try {
        const tenants = await tenantModel.getAllTenants();
        res.status(200).json(tenants);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi lấy danh sách người thuê",
            error: error.message
        });
    }
};

const createTenant = async (req, res) => {
    try {
        const {
            HoTen,
            SoDienThoai,
            Email,
            CCCD,
            NgaySinh,
            DiaChi
        } = req.body;

        if (!HoTen || !SoDienThoai || !CCCD) {
            return res.status(400).json({
                message: "Họ tên, số điện thoại và CCCD là bắt buộc"
            });
        }

        const result = await tenantModel.createTenant(
            HoTen,
            SoDienThoai,
            Email,
            CCCD,
            NgaySinh,
            DiaChi
        );

        res.status(201).json({
            message: "Thêm người thuê thành công",
            MaNguoiThue: result.insertId
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "CCCD đã tồn tại"
            });
        }

        res.status(500).json({
            message: "Lỗi thêm người thuê",
            error: error.message
        });
    }
};

const updateTenant = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            HoTen,
            SoDienThoai,
            Email,
            CCCD,
            NgaySinh,
            DiaChi
        } = req.body;

        if (!HoTen || !SoDienThoai || !CCCD) {
            return res.status(400).json({
                message: "Họ tên, số điện thoại và CCCD là bắt buộc"
            });
        }

        const result = await tenantModel.updateTenant(
            id,
            HoTen,
            SoDienThoai,
            Email,
            CCCD,
            NgaySinh,
            DiaChi
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Không tìm thấy người thuê"
            });
        }

        res.status(200).json({
            message: "Cập nhật người thuê thành công"
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "CCCD đã tồn tại"
            });
        }

        res.status(500).json({
            message: "Lỗi cập nhật người thuê",
            error: error.message
        });
    }
};

const deleteTenant = async (req, res) => {
    try {
        const result = await tenantModel.deleteTenant(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Không tìm thấy người thuê"
            });
        }

        res.status(200).json({
            message: "Xóa người thuê thành công"
        });
    } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                message: "Không thể xóa vì người thuê đang có hợp đồng"
            });
        }

        res.status(500).json({
            message: "Lỗi xóa người thuê",
            error: error.message
        });
    }
};

module.exports = {
    getAllTenants,
    createTenant,
    updateTenant,
    deleteTenant
};