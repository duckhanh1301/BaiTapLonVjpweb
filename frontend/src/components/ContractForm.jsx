import { useState } from "react";
import {
    FaCheck,
    FaFileContract,
    FaHome,
    FaTimes,
    FaUserCheck,
    FaUserPlus
} from "react-icons/fa";

const ContractForm = ({
    show,
    options,
    onClose,
    onSubmit,
    isSaving,
    error
}) => {
    const [tenantMode, setTenantMode] = useState("new");
    const [formData, setFormData] = useState({
        MaNguoiThue: "",
        MaTaiKhoan: "",
        HoTen: "",
        SoDienThoai: "",
        Email: "",
        CCCD: "",
        NgaySinh: "",
        DiaChi: "",
        MaCanHo: "",
        NgayBatDau: "",
        NgayKetThuc: "",
        GiaThue: "",
        TienCoc: "",
        TrangThai: "HieuLuc",
        GhiChu: ""
    });

    if (!show) return null;

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "MaCanHo") {
            const apartment = options.apartments.find(
                (item) => Number(item.MaCanHo) === Number(value)
            );
            setFormData((current) => ({
                ...current,
                MaCanHo: value,
                GiaThue: current.GiaThue || apartment?.GiaThue || "",
                TienCoc: current.TienCoc || apartment?.GiaThue || ""
            }));
            return;
        }

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.MaCanHo) {
            alert("Vui lòng chọn căn hộ cho thuê");
            return;
        }

        if (!formData.NgayBatDau || !formData.NgayKetThuc) {
            alert("Vui lòng nhập đầy đủ thời hạn hợp đồng");
            return;
        }

        if (formData.NgayKetThuc <= formData.NgayBatDau) {
            alert("Ngày kết thúc phải sau ngày bắt đầu");
            return;
        }

        if (!formData.GiaThue || Number(formData.GiaThue) <= 0) {
            alert("Giá thuê phải lớn hơn 0");
            return;
        }

        if (tenantMode === "existing" && !formData.MaNguoiThue) {
            alert("Vui lòng chọn người thuê");
            return;
        }

        if (
            tenantMode === "new"
            && (
                !formData.MaTaiKhoan
                || !formData.HoTen.trim()
                || !formData.SoDienThoai.trim()
                || !formData.CCCD.trim()
            )
        ) {
            alert(
                "Vui lòng nhập tài khoản, họ tên, số điện thoại và CCCD"
            );
            return;
        }

        const payload = {
            MaCanHo: formData.MaCanHo,
            NgayBatDau: formData.NgayBatDau,
            NgayKetThuc: formData.NgayKetThuc,
            GiaThue: formData.GiaThue,
            TienCoc: formData.TienCoc || 0,
            TrangThai: formData.TrangThai,
            GhiChu: formData.GhiChu.trim()
        };

        if (tenantMode === "new") {
            payload.NguoiThue = {
                MaTaiKhoan: formData.MaTaiKhoan,
                HoTen: formData.HoTen.trim(),
                SoDienThoai: formData.SoDienThoai.trim(),
                Email: formData.Email.trim(),
                CCCD: formData.CCCD.trim(),
                NgaySinh: formData.NgaySinh || null,
                DiaChi: formData.DiaChi.trim()
            };
        } else {
            payload.MaNguoiThue = formData.MaNguoiThue;
        }

        onSubmit(payload);
    };

    return (
        <div
            className="modal management-modal contract-create-modal fade show d-block"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contract-form-title"
        >
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="management-modal-header">
                        <span className="management-modal-icon contract-modal-icon">
                            <FaFileContract aria-hidden="true" />
                        </span>
                        <div>
                            <span className="management-modal-eyebrow">
                                Ghi nhận thuê nhà
                            </span>
                            <h5 id="contract-form-title">
                                Tạo hợp đồng mới
                            </h5>
                        </div>
                        <button
                            className="management-modal-close"
                            type="button"
                            onClick={onClose}
                            aria-label="Đóng"
                            disabled={isSaving}
                        >
                            <FaTimes aria-hidden="true" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="management-modal-body">
                            {error && (
                                <div className="contract-form-error" role="alert">
                                    {error}
                                </div>
                            )}

                            <section className="contract-form-section">
                                <div className="contract-form-section-heading">
                                    <span>01</span>
                                    <div>
                                        <h6>Người thuê</h6>
                                        <p>
                                            Chọn hồ sơ có sẵn hoặc tạo hồ sơ cùng hợp đồng.
                                        </p>
                                    </div>
                                </div>

                                <div className="contract-mode-toggle">
                                    <button
                                        className={tenantMode === "new" ? "is-active" : ""}
                                        type="button"
                                        onClick={() => setTenantMode("new")}
                                    >
                                        <FaUserPlus aria-hidden="true" />
                                        Người thuê mới
                                    </button>
                                    <button
                                        className={tenantMode === "existing" ? "is-active" : ""}
                                        type="button"
                                        onClick={() => setTenantMode("existing")}
                                    >
                                        <FaUserCheck aria-hidden="true" />
                                        Người thuê đã có
                                    </button>
                                </div>

                                {tenantMode === "new" ? (
                                    <div className="management-form-grid management-form-grid--apartment">
                                        <label className="management-field management-field--full">
                                            <span>Tài khoản đăng nhập <i>*</i></span>
                                            <select
                                                name="MaTaiKhoan"
                                                value={formData.MaTaiKhoan}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">
                                                    Chọn tài khoản NhanVien chưa sử dụng
                                                </option>
                                                {options.accounts.map((account) => (
                                                    <option key={account.id} value={account.id}>
                                                        {account.email}
                                                    </option>
                                                ))}
                                            </select>
                                            {options.accounts.length === 0 && (
                                                <small className="contract-option-warning">
                                                    Không có tài khoản NhanVien khả dụng.
                                                </small>
                                            )}
                                        </label>

                                        <label className="management-field management-field--half">
                                            <span>Họ và tên <i>*</i></span>
                                            <input
                                                type="text"
                                                name="HoTen"
                                                placeholder="Ví dụ: Nguyễn Minh Anh"
                                                value={formData.HoTen}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>

                                        <label className="management-field management-field--half">
                                            <span>Số điện thoại <i>*</i></span>
                                            <input
                                                type="tel"
                                                name="SoDienThoai"
                                                placeholder="Ví dụ: 0901 234 567"
                                                value={formData.SoDienThoai}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>

                                        <label className="management-field management-field--half">
                                            <span>Email</span>
                                            <input
                                                type="email"
                                                name="Email"
                                                placeholder="email@example.com"
                                                value={formData.Email}
                                                onChange={handleChange}
                                            />
                                        </label>

                                        <label className="management-field management-field--half">
                                            <span>Số CCCD <i>*</i></span>
                                            <input
                                                type="text"
                                                name="CCCD"
                                                inputMode="numeric"
                                                placeholder="Nhập số căn cước công dân"
                                                value={formData.CCCD}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>

                                        <label className="management-field management-field--half">
                                            <span>Ngày sinh</span>
                                            <input
                                                type="date"
                                                name="NgaySinh"
                                                value={formData.NgaySinh}
                                                onChange={handleChange}
                                            />
                                        </label>

                                        <label className="management-field management-field--half">
                                            <span>Địa chỉ thường trú</span>
                                            <input
                                                type="text"
                                                name="DiaChi"
                                                placeholder="Nhập địa chỉ người thuê"
                                                value={formData.DiaChi}
                                                onChange={handleChange}
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <div className="management-form-grid">
                                        <label className="management-field">
                                            <span>Người thuê <i>*</i></span>
                                            <select
                                                name="MaNguoiThue"
                                                value={formData.MaNguoiThue}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Chọn người thuê</option>
                                                {options.tenants.map((tenant) => (
                                                    <option
                                                        key={tenant.MaNguoiThue}
                                                        value={tenant.MaNguoiThue}
                                                    >
                                                        {tenant.HoTen} · {tenant.SoDienThoai}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                )}
                            </section>

                            <section className="contract-form-section">
                                <div className="contract-form-section-heading">
                                    <span>02</span>
                                    <div>
                                        <h6>Căn hộ và thời hạn</h6>
                                        <p>
                                            Chọn căn hộ, thời gian thuê và giá trị hợp đồng.
                                        </p>
                                    </div>
                                </div>

                                <div className="management-form-grid management-form-grid--apartment">
                                    <label className="management-field management-field--full">
                                        <span>Căn hộ cho thuê <i>*</i></span>
                                        <select
                                            name="MaCanHo"
                                            value={formData.MaCanHo}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Chọn căn hộ</option>
                                            {options.apartments.map((apartment) => (
                                                <option
                                                    key={apartment.MaCanHo}
                                                    value={apartment.MaCanHo}
                                                >
                                                    {apartment.TenCanHo} · {apartment.TenToaNha}
                                                    {" "}· {apartment.TrangThai || "Chưa cập nhật"}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="management-field management-field--half">
                                        <span>Ngày bắt đầu <i>*</i></span>
                                        <input
                                            type="date"
                                            name="NgayBatDau"
                                            value={formData.NgayBatDau}
                                            onChange={handleChange}
                                            required
                                        />
                                    </label>

                                    <label className="management-field management-field--half">
                                        <span>Ngày kết thúc <i>*</i></span>
                                        <input
                                            type="date"
                                            name="NgayKetThuc"
                                            value={formData.NgayKetThuc}
                                            min={formData.NgayBatDau || undefined}
                                            onChange={handleChange}
                                            required
                                        />
                                    </label>

                                    <label className="management-field management-field--third">
                                        <span>Giá thuê <i>*</i></span>
                                        <div className="management-input-suffix">
                                            <input
                                                type="number"
                                                min="1"
                                                name="GiaThue"
                                                placeholder="0"
                                                value={formData.GiaThue}
                                                onChange={handleChange}
                                                required
                                            />
                                            <small>VNĐ</small>
                                        </div>
                                    </label>

                                    <label className="management-field management-field--third">
                                        <span>Tiền cọc</span>
                                        <div className="management-input-suffix">
                                            <input
                                                type="number"
                                                min="0"
                                                name="TienCoc"
                                                placeholder="0"
                                                value={formData.TienCoc}
                                                onChange={handleChange}
                                            />
                                            <small>VNĐ</small>
                                        </div>
                                    </label>

                                    <label className="management-field management-field--third">
                                        <span>Trạng thái</span>
                                        <select
                                            name="TrangThai"
                                            value={formData.TrangThai}
                                            onChange={handleChange}
                                        >
                                            <option value="HieuLuc">Đang hiệu lực</option>
                                            <option value="HetHan">Hết hạn</option>
                                            <option value="DaHuy">Đã hủy</option>
                                        </select>
                                    </label>

                                    <label className="management-field management-field--full">
                                        <span>Ghi chú</span>
                                        <textarea
                                            rows="3"
                                            name="GhiChu"
                                            placeholder="Điều khoản hoặc ghi chú thêm..."
                                            value={formData.GhiChu}
                                            onChange={handleChange}
                                        />
                                    </label>
                                </div>
                            </section>

                            <div className="contract-transaction-note">
                                <FaHome aria-hidden="true" />
                                <p>
                                    Hồ sơ người thuê mới chỉ được lưu khi hợp đồng
                                    được tạo thành công.
                                </p>
                            </div>
                        </div>

                        <div className="management-modal-footer">
                            <button
                                className="management-secondary-button"
                                type="button"
                                onClick={onClose}
                                disabled={isSaving}
                            >
                                Hủy
                            </button>
                            <button
                                className="management-primary-button"
                                type="submit"
                                disabled={
                                    isSaving
                                    || (
                                        tenantMode === "new"
                                        && options.accounts.length === 0
                                    )
                                }
                            >
                                <FaCheck aria-hidden="true" />
                                {isSaving ? "Đang tạo..." : "Tạo hợp đồng"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContractForm;
