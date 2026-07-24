import { useState, useEffect } from "react";

const UploadImage = ({
    show,
    onClose,
    apartment,
    images,
    onUpload,
    onDelete
}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!selectedFile) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    if (!show) return null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) {
            alert("Vui lòng chọn ảnh trước khi tải lên");
            return;
        }

        const formData = new FormData();
        formData.append("MaCanHo", apartment.MaCanHo);
        formData.append("image", selectedFile);

        onUpload(formData);
        setSelectedFile(null);
    };

    return (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,.5)" }}
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            Quản lý ảnh căn hộ: {apartment.TenCanHo}
                        </h5>
                        <button className="btn-close" onClick={onClose} />
                    </div>
                    <div className="modal-body">
                        <div className="mb-3 row align-items-end">
                            <div className="col-md-5">
                                <label className="form-label">Chọn ảnh</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={handleUpload}
                                >
                                    Tải lên
                                </button>
                            </div>
                            <div className="col-md-4">
                                {preview && (
                                    <div>
                                        <small className="text-muted">Xem trước</small>
                                        <img
                                            src={preview}
                                            alt="preview"
                                            className="img-fluid rounded mt-2"
                                            style={{ maxHeight: 140 }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <h6>Ảnh hiện có</h6>
                            <div className="row g-3">
                                {images.length === 0 ? (
                                    <div className="col-12">
                                        <p className="text-muted">Chưa có ảnh nào.</p>
                                    </div>
                                ) : (
                                    images.map((image) => (
                                        <div className="col-md-3" key={image.MaAnh}>
                                            <div className="card">
                                                <img
                                                    src={
                                                        image.DuongDanAnh.startsWith("http")
                                                            ? image.DuongDanAnh
                                                            : `http://localhost:3000${image.DuongDanAnh}`
                                                    }
                                                    className="card-img-top"
                                                    alt={`Ảnh ${image.MaAnh}`}
                                                    style={{ height: 180, objectFit: "cover" }}
                                                />
                                                <div className="card-body p-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm w-100"
                                                        onClick={() => onDelete(image.MaAnh)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadImage;
