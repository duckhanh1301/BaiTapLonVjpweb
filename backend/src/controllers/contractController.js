const contractModel = require("../models/contractModel");

const allowedStatuses = ["HieuLuc", "HetHan", "DaHuy"];

const normalizeContract = (body) => ({
    MaNguoiThue: Number(body.MaNguoiThue),
    MaCanHo: Number(body.MaCanHo),
    NgayBatDau: body.NgayBatDau,
    NgayKetThuc: body.NgayKetThuc,
    GiaThue: Number(body.GiaThue),
    TienCoc:
        body.TienCoc === undefined || body.TienCoc === null
            ? 0
            : Number(body.TienCoc),
    TrangThai: body.TrangThai || "HieuLuc",
    GhiChu:
        typeof body.GhiChu === "string"
            ? body.GhiChu.trim() || null
            : null
});

const validateContract = (contract) => {
    if (
        !Number.isInteger(contract.MaNguoiThue) ||
        contract.MaNguoiThue <= 0
    ) {
        return "Mã người thuê không hợp lệ";
    }

    if (
        !Number.isInteger(contract.MaCanHo) ||
        contract.MaCanHo <= 0
    ) {
        return "Mã căn hộ không hợp lệ";
    }

    if (!contract.NgayBatDau || !contract.NgayKetThuc) {
        return "Ngày bắt đầu và ngày kết thúc là bắt buộc";
    }

    if (contract.NgayKetThuc <= contract.NgayBatDau) {
        return "Ngày kết thúc phải sau ngày bắt đầu";
    }

    if (!Number.isFinite(contract.GiaThue) || contract.GiaThue <= 0) {
        return "Giá thuê phải lớn hơn 0";
    }

    if (!Number.isFinite(contract.TienCoc) || contract.TienCoc < 0) {
        return "Tiền cọc không được âm";
    }

    if (!allowedStatuses.includes(contract.TrangThai)) {
        return "Trạng thái hợp đồng không hợp lệ";
    }

    return null;
};

const validateRelatedData = async (contract) => {
    const tenantFound = await contractModel.tenantExists(
        contract.MaNguoiThue
    );

    if (!tenantFound) {
        return "Không tìm thấy người thuê";
    }

    const apartmentFound = await contractModel.apartmentExists(
        contract.MaCanHo
    );

    if (!apartmentFound) {
        return "Không tìm thấy căn hộ";
    }

    return null;
};

const getAllContracts = async (req, res) => {
    try {
        const contracts = await contractModel.getAllContracts();
        res.status(200).json(contracts);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi lấy danh sách hợp đồng",
            error: error.message
        });
    }
};

const getExpiringContracts = async (req, res) => {
    try {
        const contracts = await contractModel.getExpiringContracts();
        res.status(200).json(contracts);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi lấy hợp đồng sắp hết hạn",
            error: error.message
        });
    }
};

const createContract = async (req, res) => {
    try {
        const contract = normalizeContract(req.body);

        const validationError = validateContract(contract);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const relatedDataError = await validateRelatedData(contract);

        if (relatedDataError) {
            return res.status(404).json({
                message: relatedDataError
            });
        }

        if (contract.TrangThai === "HieuLuc") {
            const overlapping =
                await contractModel.hasOverlappingContract(
                    contract.MaCanHo,
                    contract.NgayBatDau,
                    contract.NgayKetThuc
                );

            if (overlapping) {
                return res.status(409).json({
                    message:
                        "Căn hộ đã có hợp đồng hiệu lực trong thời gian này"
                });
            }
        }

        const result = await contractModel.createContract(contract);

        res.status(201).json({
            message: "Thêm hợp đồng thành công",
            MaHopDong: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi thêm hợp đồng",
            error: error.message
        });
    }
};

const updateContract = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Mã hợp đồng không hợp lệ"
            });
        }

        const found = await contractModel.contractExists(id);

        if (!found) {
            return res.status(404).json({
                message: "Không tìm thấy hợp đồng"
            });
        }

        const contract = normalizeContract(req.body);
        const validationError = validateContract(contract);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const relatedDataError = await validateRelatedData(contract);

        if (relatedDataError) {
            return res.status(404).json({
                message: relatedDataError
            });
        }

        if (contract.TrangThai === "HieuLuc") {
            const overlapping =
                await contractModel.hasOverlappingContract(
                    contract.MaCanHo,
                    contract.NgayBatDau,
                    contract.NgayKetThuc,
                    id
                );

            if (overlapping) {
                return res.status(409).json({
                    message:
                        "Căn hộ đã có hợp đồng hiệu lực trong thời gian này"
                });
            }
        }

        await contractModel.updateContract(id, contract);

        res.status(200).json({
            message: "Cập nhật hợp đồng thành công"
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi cập nhật hợp đồng",
            error: error.message
        });
    }
};

const deleteContract = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Mã hợp đồng không hợp lệ"
            });
        }

        const found = await contractModel.contractExists(id);

        if (!found) {
            return res.status(404).json({
                message: "Không tìm thấy hợp đồng"
            });
        }

        await contractModel.deleteContract(id);

        res.status(200).json({
            message: "Xóa hợp đồng thành công"
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi xóa hợp đồng",
            error: error.message
        });
    }
};

module.exports = {
    getAllContracts,
    getExpiringContracts,
    createContract,
    updateContract,
    deleteContract
};