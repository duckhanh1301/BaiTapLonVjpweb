import { useState } from "react";
import { Buildings, Check, X } from "@boxicons/react";

const BuildingForm = ({ show, onClose, onSubmit, building }) => {
    const [formData, setFormData] = useState(() => ({
        TenToaNha: building?.TenToaNha || "",
        DiaChi: building?.DiaChi || "",
        MoTa: building?.MoTa || ""
    }));

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.TenToaNha.trim()) {
            alert("Vui lòng nhập tên tòa nhà");
            return;
        }

        if (!formData.DiaChi.trim()) {
            alert("Vui lòng nhập địa chỉ");
            return;
        }

        onSubmit(formData);
    };

    if (!show) return null;

    return (
        <div className="modal management-modal fade show d-block" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="management-modal-header">
                        <span className="management-modal-icon">
                            <Buildings aria-hidden="true" />
                        </span>
                        <div>
                            <span className="management-modal-eyebrow">Thông tin tòa nhà</span>
                            <h5>{building ? "Cập nhật tòa nhà" : "Thêm tòa nhà mới"}</h5>
                        </div>
                        <button
                            className="management-modal-close"
                            type="button"
                            onClick={onClose}
                            aria-label="Đóng"
                        >
                            <X aria-hidden="true" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="management-modal-body">
                            <div className="management-form-grid">
                                <label className="management-field">
                                    <span>Tên tòa nhà <i>*</i></span>
                                    <input
                                        type="text"
                                        name="TenToaNha"
                                        placeholder="Ví dụ: Landmark Riverside"
                                        value={formData.TenToaNha}
                                        onChange={handleChange}
                                        autoFocus
                                    />
                                </label>

                                <label className="management-field">
                                    <span>Địa chỉ <i>*</i></span>
                                    <input
                                        type="text"
                                        name="DiaChi"
                                        placeholder="Nhập địa chỉ đầy đủ"
                                        value={formData.DiaChi}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="management-field">
                                    <span>Mô tả</span>
                                    <textarea
                                        rows="4"
                                        name="MoTa"
                                        placeholder="Ghi chú thêm về tòa nhà..."
                                        value={formData.MoTa}
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
                            >
                                Hủy
                            </button>
                            <button className="management-primary-button" type="submit">
                                <Check aria-hidden="true" />
                                {building ? "Lưu thay đổi" : "Thêm tòa nhà"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BuildingForm;
