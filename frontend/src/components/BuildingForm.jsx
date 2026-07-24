import { useEffect, useState } from "react";

const BuildingForm = ({ show, onClose, onSubmit, building }) => {

    const [formData, setFormData] = useState({
        TenToaNha: "",
        DiaChi: "",
        MoTa: ""
    });

    useEffect(() => {

        if (building) {

            setFormData({
                TenToaNha: building.TenToaNha || "",
                DiaChi: building.DiaChi || "",
                MoTa: building.MoTa || ""
            });

        } else {

            setFormData({
                TenToaNha: "",
                DiaChi: "",
                MoTa: ""
            });

        }

    }, [building]);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

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

        <div
            className="modal fade show d-block"
            style={{
                backgroundColor: "rgba(0,0,0,.5)"
            }}
        >

            <div className="modal-dialog">

                <div className="modal-content">

                    <div className="modal-header">

                        <h5 className="modal-title">

                            {building ? "Cập nhật tòa nhà" : "Thêm tòa nhà"}

                        </h5>

                        <button
                            className="btn-close"
                            onClick={onClose}
                        />

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="modal-body">

                            <div className="mb-3">

                                <label className="form-label">
                                    Tên tòa nhà
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="TenToaNha"
                                    value={formData.TenToaNha}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Địa chỉ
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="DiaChi"
                                    value={formData.DiaChi}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Mô tả
                                </label>

                                <textarea
                                    rows="4"
                                    className="form-control"
                                    name="MoTa"
                                    value={formData.MoTa}
                                    onChange={handleChange}
                                />

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

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                {building ? "Cập nhật" : "Thêm"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

};

export default BuildingForm;