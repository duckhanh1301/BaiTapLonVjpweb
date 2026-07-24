import { useEffect, useState } from "react";

const ApartmentForm = ({ show, onClose, onSubmit, apartment, buildings }) => {
    const [formData, setFormData] = useState({
        MaToaNha: "",
        TenCanHo: "",
        GiaThue: "",
        DienTich: "",
        Tang: "",
        SoPhongNgu: "",
        SoPhongTam: "",
        TrangThai: "",
        MoTa: ""
    });

    useEffect(() => {
        if (apartment) {
            setFormData({
                MaToaNha: apartment.MaToaNha || "",
                TenCanHo: apartment.TenCanHo || "",
                GiaThue: apartment.GiaThue || "",
                DienTich: apartment.DienTich || "",
                Tang: apartment.Tang || "",
                SoPhongNgu: apartment.SoPhongNgu || "",
                SoPhongTam: apartment.SoPhongTam || "",
                TrangThai: apartment.TrangThai || "",
                MoTa: apartment.MoTa || ""
            });
        } else {
            setFormData({
                MaToaNha: "",
                TenCanHo: "",
                GiaThue: "",
                DienTich: "",
                Tang: "",
                SoPhongNgu: "",
                SoPhongTam: "",
                TrangThai: "",
                MoTa: ""
            });
        }
    }, [apartment]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

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
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,.5)" }}
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {apartment ? "Cập nhật căn hộ" : "Thêm căn hộ"}
                        </h5>
                        <button className="btn-close" onClick={onClose} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Tòa nhà</label>
                                    <select
                                        className="form-select"
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
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Tên căn hộ</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="TenCanHo"
                                        value={formData.TenCanHo}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Giá thuê</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="GiaThue"
                                        value={formData.GiaThue}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Diện tích</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="DienTich"
                                        value={formData.DienTich}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Tầng</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="Tang"
                                        value={formData.Tang}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Số phòng ngủ</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="SoPhongNgu"
                                        value={formData.SoPhongNgu}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Số phòng tắm</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="SoPhongTam"
                                        value={formData.SoPhongTam}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Trạng thái</label>
                                    <select
                                        className="form-select"
                                        name="TrangThai"
                                        value={formData.TrangThai}
                                        onChange={handleChange}
                                    >
                                        <option value="">Chọn trạng thái</option>
                                        <option value="Trống">Trống</option>
                                        <option value="Đã thuê">Đã thuê</option>
                                    </select>
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Mô tả</label>
                                    <textarea
                                        rows="4"
                                        className="form-control"
                                        name="MoTa"
                                        value={formData.MoTa}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Hủy
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {apartment ? "Cập nhật" : "Thêm"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApartmentForm;
