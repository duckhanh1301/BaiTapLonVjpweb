import { useState } from 'react';
import { toast } from 'react-toastify';
import '../styles/RepairRequestPage.css';

const REPAIR_TYPES = [
    'Điều hòa hỏng',
    'Nước rò',
    'Đèn hỏng',
    'Máy giặt hỏng',
    'Cửa/khóa hỏng',
    'Vòi nước hỏng',
    'Toilet hỏng',
    'Các vấn đề khác'
];

const RepairRequestPage = () => {
    const [formData, setFormData] = useState({
        repairType: '',
        description: '',
        urgentLevel: 'Bình thường'
    });
    const [loading, setLoading] = useState(false);
    const [submittedRequests, setSubmittedRequests] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.repairType) {
            toast.error('Vui lòng chọn loại hư hỏng');
            return;
        }

        if (!formData.description.trim()) {
            toast.error('Vui lòng mô tả chi tiết vấn đề');
            return;
        }

        try {
            setLoading(true);
            // TODO: Call API to submit repair request
            // For now, just simulate successful submission
            const newRequest = {
                id: Date.now(),
                type: formData.repairType,
                description: formData.description,
                urgentLevel: formData.urgentLevel,
                status: 'Chờ xử lý',
                submittedDate: new Date().toLocaleDateString('vi-VN'),
                submittedTime: new Date().toLocaleTimeString('vi-VN')
            };

            setSubmittedRequests(prev => [newRequest, ...prev]);
            setFormData({
                repairType: '',
                description: '',
                urgentLevel: 'Bình thường'
            });

            toast.success('Gửi yêu cầu sửa chữa thành công. Admin sẽ xem xét sớm!');
        } catch (error) {
            console.error('Lỗi:', error);
            toast.error('Gửi yêu cầu thất bại. Vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'Chờ xử lý': 'bg-warning',
            'Đang xử lý': 'bg-info',
            'Hoàn thành': 'bg-success',
            'Từ chối': 'bg-danger'
        };
        return statusMap[status] || 'bg-secondary';
    };

    const getUrgentLevelColor = (level) => {
        const colorMap = {
            'Bình thường': 'text-success',
            'Khẩn cấp': 'text-warning',
            'Rất khẩn cấp': 'text-danger'
        };
        return colorMap[level] || 'text-secondary';
    };

    return (
        <div className="repair-request-page">
            <div className="container py-4">
                <h1 className="mb-4">Gửi Yêu Cầu Sửa Chữa</h1>

                <div className="row">
                    {/* Form Section */}
                    <div className="col-md-6 mb-4">
                        <div className="card repair-form-card">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">Mẫu Yêu Cầu Sửa Chữa</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    {/* Repair Type */}
                                    <div className="mb-3">
                                        <label htmlFor="repairType" className="form-label">
                                            Loại Hư Hỏng
                                        </label>
                                        <select
                                            id="repairType"
                                            name="repairType"
                                            className="form-select"
                                            value={formData.repairType}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        >
                                            <option value="">-- Chọn loại hư hỏng --</option>
                                            {REPAIR_TYPES.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">
                                            Mô Tả Chi Tiết
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            className="form-control"
                                            rows="4"
                                            placeholder="Mô tả chi tiết vấn đề đang gặp phải..."
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        ></textarea>
                                    </div>

                                    {/* Urgent Level */}
                                    <div className="mb-3">
                                        <label htmlFor="urgentLevel" className="form-label">
                                            Mức Độ Ưu Tiên
                                        </label>
                                        <select
                                            id="urgentLevel"
                                            name="urgentLevel"
                                            className="form-select"
                                            value={formData.urgentLevel}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        >
                                            <option value="Bình thường">Bình thường</option>
                                            <option value="Khẩn cấp">Khẩn cấp</option>
                                            <option value="Rất khẩn cấp">Rất khẩn cấp</option>
                                        </select>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Đang gửi...
                                            </>
                                        ) : (
                                            'Gửi Yêu Cầu'
                                        )}
                                    </button>

                                    <div className="alert alert-info mt-3">
                                        <i className="bi bi-info-circle"></i> <strong>Lưu ý:</strong> Admin sẽ liên hệ với bạn
                                        trong thời gian sớm nhất để xác nhận và thực hiện sửa chữa.
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Requests History */}
                    <div className="col-md-6">
                        <div className="card requests-history-card">
                            <div className="card-header bg-secondary text-white">
                                <h5 className="mb-0">Lịch Sử Yêu Cầu ({submittedRequests.length})</h5>
                            </div>
                            <div className="card-body">
                                {submittedRequests.length === 0 ? (
                                    <p className="text-muted text-center py-4">
                                        Bạn chưa gửi yêu cầu sửa chữa nào
                                    </p>
                                ) : (
                                    <div className="requests-list">
                                        {submittedRequests.map(request => (
                                            <div key={request.id} className="request-item card mb-2">
                                                <div className="card-body p-3">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <h6 className="mb-0">{request.type}</h6>
                                                        <span className={`badge ${getStatusBadge(request.status)}`}>
                                                            {request.status}
                                                        </span>
                                                    </div>
                                                    <p className="mb-2 text-muted small">
                                                        {request.submittedDate} {request.submittedTime}
                                                    </p>
                                                    <p className="mb-2">{request.description}</p>
                                                    <p className={`mb-0 small ${getUrgentLevelColor(request.urgentLevel)}`}>
                                                        <strong>Mức độ: {request.urgentLevel}</strong>
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepairRequestPage;
