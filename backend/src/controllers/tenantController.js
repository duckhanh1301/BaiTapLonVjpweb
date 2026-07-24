const tenantModel = require("../models/tenantModel");

const normalizeTenant = (body, MaTaiKhoan) => ({
    MaTaiKhoan,
    HoTen: typeof body.HoTen === "string" ? body.HoTen.trim() : "",
    SoDienThoai:
        typeof body.SoDienThoai === "string"
            ? body.SoDienThoai.trim()
            : "",
    Email:
        typeof body.Email === "string"
            ? body.Email.trim() || null
            : null,
    CCCD: typeof body.CCCD === "string" ? body.CCCD.trim() : "",
    NgaySinh: body.NgaySinh || null,
    DiaChi:
        typeof body.DiaChi === "string"
            ? body.DiaChi.trim() || null
            : null
});

const validateTenant = (tenant) => {
    if (!tenant.HoTen || !tenant.SoDienThoai || !tenant.CCCD) {
        return "Họ tên, số điện thoại và CCCD là bắt buộc";
    }

    if (!Number.isInteger(tenant.MaTaiKhoan) || tenant.MaTaiKhoan <= 0) {
        return "Mã tài khoản người thuê không hợp lệ";
    }

    return null;
};

const validateTenantAccount = async (
    accountId,
    excludedTenantId = null
) => {
    const accountFound = await tenantModel.tenantAccountExists(accountId);

    if (!accountFound) {
        return "Tài khoản không tồn tại hoặc không có role NhanVien";
    }

    const alreadyLinked = await tenantModel.accountAlreadyLinked(
        accountId,
        excludedTenantId
    );

    return alreadyLinked
        ? "Tài khoản này đã liên kết với một người thuê khác"
        : null;
};

const getAllTenants = async (req, res) => {
    try {
        const accountId = req.user.role === "NhanVien"
            ? Number(req.user.id)
            : null;
        const tenants = await tenantModel.getAllTenants(accountId);

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
        const accountId = Number(req.body.MaTaiKhoan);
        const tenant = normalizeTenant(req.body, accountId);
        const validationError = validateTenant(tenant);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const accountError = await validateTenantAccount(accountId);

        if (accountError) {
            return res.status(400).json({ message: accountError });
        }

        const result = await tenantModel.createTenant(tenant);

        res.status(201).json({
            message: "Thêm người thuê thành công",
            MaNguoiThue: result.insertId
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "CCCD hoặc tài khoản người thuê đã tồn tại"
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
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Mã người thuê không hợp lệ"
            });
        }

        const existingTenant = await tenantModel.getTenantById(id);

        if (!existingTenant) {
            return res.status(404).json({
                message: "Không tìm thấy người thuê"
            });
        }

        if (
            req.user.role === "NhanVien"
            && Number(existingTenant.MaTaiKhoan) !== Number(req.user.id)
        ) {
            return res.status(403).json({
                message: "Bạn chỉ có thể cập nhật hồ sơ người thuê của mình"
            });
        }

        const accountId = req.user.role === "NhanVien"
            ? Number(req.user.id)
            : Number(req.body.MaTaiKhoan ?? existingTenant.MaTaiKhoan);
        const tenant = normalizeTenant(req.body, accountId);
        const validationError = validateTenant(tenant);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const accountError = await validateTenantAccount(accountId, id);

        if (accountError) {
            return res.status(400).json({ message: accountError });
        }

        await tenantModel.updateTenant(id, tenant);

        res.status(200).json({
            message: "Cập nhật người thuê thành công"
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "CCCD hoặc tài khoản người thuê đã tồn tại"
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
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Mã người thuê không hợp lệ"
            });
        }

        const existingTenant = await tenantModel.getTenantById(id);

        if (!existingTenant) {
            return res.status(404).json({
                message: "Không tìm thấy người thuê"
            });
        }

        await tenantModel.deleteTenant(id);

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
