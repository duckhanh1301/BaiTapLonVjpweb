import { useState } from "react";
import { Apartment, Check, X } from "@boxicons/react";

const ApartmentForm = ({ show, onClose, onSubmit, apartment, buildings }) => {
    const [formData, setFormData] = useState(() => ({
        MaToaNha: apartment?.MaToaNha || "",
        TenCanHo: apartment?.TenCanHo || "",
        GiaThue: apartment?.GiaThue || "",
        DienTich: apartment?.DienTich || "",
        Tang: apartment?.Tang || "",
        SoPhongNgu: apartment?.SoPhongNgu || "",
        SoPhongTam: apartment?.SoPhongTam || "",
        TrangThai: apartment?.TrangThai || "",
        MoTa: apartment?.MoTa || ""
    }));

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.MaToaNha) {
            alert("Vui lòng chọn tòa nhà");
            return;
        }

        if (!formData.TenCanHo.trim()) {
            alert("Vui lòng nhập tên căn hộ");
            return;
        }

        onSubmit(formData);
    };

    if (!show) return null;

    return (
        <div className="modal management-modal fade show d-block" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="management-modal-header">
                        <span className="management-modal-icon is-apartment">
                            <Apartment aria-hidden="true" />
                        </span>
                        <div>
                            <span className="management-modal-eyebrow">Thông tin căn hộ</span>
                            <h5>{apartment ? "Cập nhật căn hộ" : "Thêm căn hộ mới"}</h5>
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
                            <div className="management-form-grid management-form-grid--apartment">
                                <label className="management-field management-field--half">
                                    <span>Tòa nhà <i>*</i></span>
                                    <select
                                        name="MaToaNha"
                                        value={formData.MaToaNha}
                                        onChange={handleChange}
                                    >
                                        <option value="">Chọn tòa nhà</option>
                                        {buildings.map((building) => (
                                            <option
                                                key={building.MaToaNha}
                                                value={building.MaToaNha}
                                            >
                                                {building.TenToaNha}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="management-field management-field--half">
                                    <span>Tên căn hộ <i>*</i></span>
                                    <input
                                        type="text"
                                        name="TenCanHo"
                                        placeholder="Ví dụ: Căn hộ A1208"
                                        value={formData.TenCanHo}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="management-field management-field--third">
                                    <span>Giá thuê</span>
                                    <div className="management-input-suffix">
                                        <input
                                            type="number"
                                            min="0"
                                            name="GiaThue"
                                            placeholder="0"
                                            value={formData.GiaThue}
                                            onChange={handleChange}
                                        />
                                        <small>VNĐ</small>
                                    </div>
                                </label>

                                <label className="management-field management-field--third">
                                    <span>Diện tích</span>
                                    <div className="management-input-suffix">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            name="DienTich"
                                            placeholder="0"
                                            value={formData.DienTich}
                                            onChange={handleChange}
                                        />
                                        <small>m²</small>
                                    </div>
                                </label>

                                <label className="management-field management-field--third">
                                    <span>Tầng</span>
                                    <input
                                        type="number"
                                        min="0"
                                        name="Tang"
                                        placeholder="0"
                                        value={formData.Tang}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="management-field management-field--third">
                                    <span>Số phòng ngủ</span>
                                    <input
                                        type="number"
                                        min="0"
                                        name="SoPhongNgu"
                                        placeholder="0"
                                        value={formData.SoPhongNgu}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="management-field management-field--third">
                                    <span>Số phòng tắm</span>
                                    <input
                                        type="number"
                                        min="0"
                                        name="SoPhongTam"
                                        placeholder="0"
                                        value={formData.SoPhongTam}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="management-field management-field--third">
                                    <span>Trạng thái</span>
                                    <select
                                        name="TrangThai"
                                        value={formData.TrangThai}
                                        onChange={handleChange}
                                    >
                                        <option value="">Chọn trạng thái</option>
                                        <option value="Trống">Trống</option>
                                        <option value="Đã thuê">Đã thuê</option>
                                    </select>
                                </label>

                                <label className="management-field management-field--full">
                                    <span>Mô tả</span>
                                    <textarea
                                        rows="4"
                                        name="MoTa"
                                        placeholder="Ghi chú về nội thất, hướng căn hộ hoặc tiện ích..."
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
                                {apartment ? "Lưu thay đổi" : "Thêm căn hộ"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApartmentForm;
