import { useEffect, useState } from "react";
import { Camera, Image, Plus, Trash, X } from "@boxicons/react";

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
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    if (!show) return null;

    const handleFileChange = (event) => {
        if (event.target.files?.[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
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
        setPreview(null);
    };

    const handleClose = () => {
        setSelectedFile(null);
        setPreview(null);
        onClose();
    };

    return (
        <div className="modal management-modal fade show d-block" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="management-modal-header">
                        <span className="management-modal-icon is-image">
                            <Camera aria-hidden="true" />
                        </span>
                        <div>
                            <span className="management-modal-eyebrow">Thư viện căn hộ</span>
                            <h5>{apartment.TenCanHo || "Căn hộ"}</h5>
                        </div>
                        <button
                            className="management-modal-close"
                            type="button"
                            onClick={handleClose}
                            aria-label="Đóng"
                        >
                            <X aria-hidden="true" />
                        </button>
                    </div>

                    <div className="management-modal-body">
                        <section className="image-upload-section">
                            <div className="image-upload-copy">
                                <span>
                                    <Image aria-hidden="true" />
                                </span>
                                <div>
                                    <strong>Thêm ảnh căn hộ</strong>
                                    <p>Chọn ảnh rõ nét để cập nhật thư viện.</p>
                                </div>
                            </div>

                            <div className="image-upload-controls">
                                <label className="image-file-input">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <span>{selectedFile?.name || "Chọn ảnh từ thiết bị"}</span>
                                </label>
                                <button
                                    className="management-primary-button"
                                    type="button"
                                    onClick={handleUpload}
                                >
                                    <Plus aria-hidden="true" />
                                    Tải ảnh lên
                                </button>
                            </div>

                            {preview && (
                                <div className="image-upload-preview">
                                    <img src={preview} alt="Ảnh xem trước" />
                                    <div>
                                        <span>Xem trước</span>
                                        <strong>{selectedFile?.name}</strong>
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className="image-gallery-section">
                            <div className="image-gallery-heading">
                                <div>
                                    <h6>Ảnh hiện có</h6>
                                    <p>{images.length} ảnh trong thư viện</p>
                                </div>
                            </div>

                            {images.length === 0 ? (
                                <div className="image-gallery-empty">
                                    <Image aria-hidden="true" />
                                    <strong>Chưa có ảnh nào</strong>
                                    <p>Ảnh tải lên sẽ xuất hiện tại đây.</p>
                                </div>
                            ) : (
                                <div className="image-gallery-grid">
                                    {images.map((image) => (
                                        <article className="image-gallery-card" key={image.MaAnh}>
                                            <img
                                                src={
                                                    image.DuongDanAnh.startsWith("http")
                                                        ? image.DuongDanAnh
                                                        : `http://localhost:3000${image.DuongDanAnh}`
                                                }
                                                alt={`Ảnh căn hộ ${image.MaAnh}`}
                                            />
                                            <div>
                                                <span>Ảnh #{image.MaAnh}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(image.MaAnh)}
                                                    aria-label={`Xóa ảnh ${image.MaAnh}`}
                                                >
                                                    <Trash aria-hidden="true" />
                                                    Xóa
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="management-modal-footer">
                        <button
                            className="management-secondary-button"
                            type="button"
                            onClick={handleClose}
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
