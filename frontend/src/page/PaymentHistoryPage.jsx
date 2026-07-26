import { useState, useEffect } from 'react';
import '../styles/PaymentHistoryPage.css';

// Mock data - replace with real API calls
const mockPayments = [
    {
        id: 1,
        month: 'Tháng 7/2026',
        amount: 3500000,
        status: 'Đã thanh toán',
        paymentDate: '2026-07-05',
        dueDate: '2026-07-01'
    },
    {
        id: 2,
        month: 'Tháng 6/2026',
        amount: 3500000,
        status: 'Đã thanh toán',
        paymentDate: '2026-06-03',
        dueDate: '2026-06-01'
    },
    {
        id: 3,
        month: 'Tháng 5/2026',
        amount: 3500000,
        status: 'Đã thanh toán',
        paymentDate: '2026-05-01',
        dueDate: '2026-05-01'
    },
    {
        id: 4,
        month: 'Tháng 8/2026',
        amount: 3500000,
        status: 'Chờ thanh toán',
        paymentDate: null,
        dueDate: '2026-08-01'
    }
];

const PaymentHistoryPage = () => {
    const [payments, setPayments] = useState(mockPayments);
    const [filterStatus, setFilterStatus] = useState('');
    const [filteredPayments, setFilteredPayments] = useState(mockPayments);

    useEffect(() => {
        if (filterStatus) {
            setFilteredPayments(payments.filter(p => p.status === filterStatus));
        } else {
            setFilteredPayments(payments);
        }
    }, [filterStatus, payments]);

    const formatCurrency = (value) => {
        return Number(value || 0).toLocaleString('vi-VN') + 'đ';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa thanh toán';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'Đã thanh toán': 'bg-success',
            'Chờ thanh toán': 'bg-warning',
            'Quá hạn': 'bg-danger',
            'Đã từ chối': 'bg-secondary'
        };
        return statusMap[status] || 'bg-secondary';
    };

    const calculateTotalPaid = () => {
        return payments
            .filter(p => p.status === 'Đã thanh toán')
            .reduce((sum, p) => sum + p.amount, 0);
    };

    const calculateTotalPending = () => {
        return payments
            .filter(p => p.status === 'Chờ thanh toán')
            .reduce((sum, p) => sum + p.amount, 0);
    };

    return (
        <div className="payment-history-page">
            <div className="container py-4">
                <h1 className="mb-4">Lịch Sử Thanh Toán</h1>

                {/* Summary Cards */}
                <div className="row mb-4">
                    <div className="col-md-4 mb-3">
                        <div className="card summary-card">
                            <div className="card-body">
                                <h6 className="card-title text-muted">Đã Thanh Toán</h6>
                                <h4 className="text-success">{formatCurrency(calculateTotalPaid())}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card summary-card">
                            <div className="card-body">
                                <h6 className="card-title text-muted">Chờ Thanh Toán</h6>
                                <h4 className="text-warning">{formatCurrency(calculateTotalPending())}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card summary-card">
                            <div className="card-body">
                                <h6 className="card-title text-muted">Tổng Hợp Đồng</h6>
                                <h4 className="text-primary">{formatCurrency(calculateTotalPaid() + calculateTotalPending())}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="mb-3">
                    <select
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">-- Tất cả trạng thái --</option>
                        <option value="Đã thanh toán">Đã thanh toán</option>
                        <option value="Chờ thanh toán">Chờ thanh toán</option>
                        <option value="Quá hạn">Quá hạn</option>
                    </select>
                </div>

                {/* Payment Table */}
                <div className="card">
                    <div className="card-header bg-light">
                        <h5 className="mb-0">Chi Tiết Thanh Toán</h5>
                    </div>
                    <div className="card-body">
                        {filteredPayments.length === 0 ? (
                            <p className="text-center text-muted py-4">
                                Không có dữ liệu thanh toán
                            </p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th>Tháng</th>
                                            <th>Số Tiền</th>
                                            <th>Hạn Thanh Toán</th>
                                            <th>Ngày Thanh Toán</th>
                                            <th>Trạng Thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPayments.map((payment) => (
                                            <tr key={payment.id}>
                                                <td>
                                                    <strong>{payment.month}</strong>
                                                </td>
                                                <td>
                                                    <span className="text-danger fw-bold">
                                                        {formatCurrency(payment.amount)}
                                                    </span>
                                                </td>
                                                <td>{formatDate(payment.dueDate)}</td>
                                                <td>
                                                    {payment.status === 'Đã thanh toán' ? (
                                                        <span className="text-success">{formatDate(payment.paymentDate)}</span>
                                                    ) : (
                                                        <span className="text-muted">--</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStatusBadge(payment.status)}`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Instructions */}
                <div className="card mt-4">
                    <div className="card-header bg-info text-white">
                        <h5 className="mb-0">Hướng Dẫn Thanh Toán</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <h6>Thông Tin Tài Khoản Ngân Hàng</h6>
                                <ul className="list-unstyled">
                                    <li><strong>Chủ tài khoản:</strong> Công Ty TNHH Quản Lý Tòa Nhà ABC</li>
                                    <li><strong>Số tài khoản:</strong> 123456789</li>
                                    <li><strong>Ngân hàng:</strong> VietcomBank</li>
                                    <li><strong>Chi nhánh:</strong> Hà Nội</li>
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <h6>Nội Dung Chuyển Khoản</h6>
                                <p>Tiền nhà tháng [X] - [Tên căn hộ]</p>
                                <p className="text-muted small">
                                    VD: Tiền nhà tháng 7 - A101
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistoryPage;
