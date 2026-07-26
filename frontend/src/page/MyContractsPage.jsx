import { useEffect, useState } from 'react';
import { getMyContracts } from '../services/contractService';
import '../styles/MyContractsPage.css';

const MyContractsPage = () => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMyContracts();
    }, []);

    const fetchMyContracts = async () => {
        try {
            setLoading(true);
            const data = await getMyContracts();
            setContracts(data);
        } catch (err) {
            console.error('Lỗi khi lấy hợp đồng:', err);
            setError('Không thể lấy danh sách hợp đồng của bạn');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return Number(value || 0).toLocaleString('vi-VN') + 'đ';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN');
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'HieuLuc': 'bg-success',
            'HetHan': 'bg-danger',
            'DaHuy': 'bg-secondary'
        };
        const statusText = {
            'HieuLuc': 'Hiệu lực',
            'HetHan': 'Hết hạn',
            'DaHuy': 'Đã hủy'
        };
        return (
            <span className={`badge ${statusMap[status] || 'bg-secondary'}`}>
                {statusText[status] || status}
            </span>
        );
    };

    return (
        <div className="my-contracts-page">
            <div className="container py-4">
                <h1 className="mb-4">Hợp Đồng Của Tôi</h1>

                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : contracts.length === 0 ? (
                    <div className="alert alert-info">
                        Bạn hiện không có hợp đồng nào.
                    </div>
                ) : (
                    <div className="contracts-list">
                        {contracts.map((contract) => (
                            <div key={contract.MaHopDong} className="card mb-3 contract-card">
                                <div className="card-header bg-light">
                                    <div className="row align-items-center">
                                        <div className="col-md-6">
                                            <h5 className="mb-0">{contract.TenCanHo} - {contract.TenToaNha}</h5>
                                        </div>
                                        <div className="col-md-6 text-end">
                                            {getStatusBadge(contract.TrangThai)}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <p><strong>Người thuê:</strong> {contract.HoTen}</p>
                                            <p><strong>CCCD:</strong> {contract.CCCD}</p>
                                            <p><strong>Số điện thoại:</strong> {contract.SoDienThoai}</p>
                                            <p><strong>Email:</strong> {contract.Email}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>Ngày bắt đầu:</strong> {formatDate(contract.NgayBatDau)}</p>
                                            <p><strong>Ngày kết thúc:</strong> {formatDate(contract.NgayKetThuc)}</p>
                                            <p><strong>Giá thuê:</strong> <span className="text-danger">{formatCurrency(contract.GiaThue)}</span>/tháng</p>
                                            {contract.TienCoc && (
                                                <p><strong>Tiền cọc:</strong> {formatCurrency(contract.TienCoc)}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <p><strong>Địa chỉ tòa nhà:</strong> {contract.DiaChiToaNha}</p>
                                            <p><strong>Tầng:</strong> {contract.Tang}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>Diện tích:</strong> {contract.DienTich} m²</p>
                                            <p><strong>Phòng ngủ / Phòng tắm:</strong> {contract.SoPhongNgu}/{contract.SoPhongTam}</p>
                                        </div>
                                    </div>

                                    {contract.GhiChu && (
                                        <div className="row mt-3">
                                            <div className="col-12">
                                                <p><strong>Ghi chú:</strong></p>
                                                <p className="text-muted">{contract.GhiChu}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyContractsPage;
