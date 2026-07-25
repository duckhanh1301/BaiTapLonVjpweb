import { useState } from "react";
import {
    FaCheck,
    FaFileContract,
    FaHome,
    FaTimes,
    FaUser
} from "react-icons/fa";

const toDateInputValue = (value) => (
    value ? String(value).slice(0, 10) : ""
);

const TenantForm = ({
    show,
    tenant,
    onClose,
    onSubmit,
    isSaving,
    error
}) => {
    const [formData, setFormData] = useState(() => ({
        HoTen: tenant?.HoTen || "",
        SoDienThoai: tenant?.SoDienThoai || "",
        Email: tenant?.Email || "",
        CCCD: tenant?.CCCD || "",
        NgaySinh: toDateInputValue(tenant?.NgaySinh),
        DiaChi: tenant?.DiaChi || ""
    }));

    if (!show) return null;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({
            ...formData,
            HoTen: formData.HoTen.trim(),
            SoDienThoai: formData.SoDienThoai.trim(),
            Email: formData.Email.trim(),
            CCCD: formData.CCCD.trim(),
            DiaChi: formData.DiaChi.trim()
        });
    };

    return (
        <div
            className="modal management-modal tenant-modal fade show d-block"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tenant-form-title"
        >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="management-modal-header">
                        <span className="management-modal-icon tenant-modal-icon">
                            <FaUser aria-hidden="true" />
                        </span>
                        <div>
                            <span className="management-modal-eyebrow">
                                Hồ sơ người thuê
                            </span>
                            <h5 id="tenant-form-title">
                                Cập nhật thông tin người thuê
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
                            {tenant?.TenCanHo && (
                                <div className="tenant-contract-note">
                                    <span>
                                        <FaHome aria-hidden="true" />
                                    </span>
                                    <div>
                                        <small>Căn hộ đang thuê</small>
                                        <strong>
                                            {tenant.TenCanHo} · {tenant.TenToaNha}
                                        </strong>
                                        <p>
                                            <FaFileContract aria-hidden="true" />
                                            Thông tin căn hộ được cập nhật từ hợp đồng.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="tenant-form-error" role="alert">
                                    {error}
                                </div>
                            )}

                            <div className="management-form-grid management-form-grid--apartment">
                                <label className="management-field management-field--half">
                                    <span>Họ và tên <i>*</i></span>
                                    <input
                                        type="text"
                                        name="HoTen"
                                        placeholder="Ví dụ: Nguyễn Minh Anh"
                                        value={formData.HoTen}
                                        onChange={handleChange}
                                        required
                                        autoFocus
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
                                disabled={isSaving}
                            >
                                <FaCheck aria-hidden="true" />
                                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TenantForm;
