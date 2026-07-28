import { useEffect, useState } from 'react';
import { getPayments } from '../services/paymentService';
import '../styles/PaymentHistoryPage.css';
const status = { ChoThanhToan: 'Chờ thanh toán', DaThanhToan: 'Đã thanh toán', QuaHan: 'Quá hạn', TuChoi: 'Từ chối' };
const PaymentHistoryPage = () => {
    const [payments, setPayments] = useState([]); const [error, setError] = useState('');
    useEffect(() => { getPayments().then(setPayments).catch(() => setError('Không thể tải hóa đơn.')); }, []);
    const money = x => Number(x || 0).toLocaleString('vi-VN') + ' đ';
    return <div className="payment-history-page"><div className="container py-4"><h1 className="mb-4">Hóa đơn & thanh toán</h1>{error && <div className="alert alert-danger">{error}</div>}<div className="card"><div className="card-body table-responsive"><table className="table table-hover mb-0"><thead><tr><th>Kỳ thanh toán</th><th>Căn hộ</th><th>Số tiền</th><th>Hạn thanh toán</th><th>Ngày thanh toán</th><th>Trạng thái</th></tr></thead><tbody>{payments.length ? payments.map(x => <tr key={x.MaHoaDon}><td>{new Date(x.KyThanhToan).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })}</td><td>{x.TenCanHo}</td><td className="fw-bold">{money(x.SoTien)}</td><td>{new Date(x.HanThanhToan).toLocaleDateString('vi-VN')}</td><td>{x.NgayThanhToan ? new Date(x.NgayThanhToan).toLocaleDateString('vi-VN') : '--'}</td><td><span className="badge bg-secondary">{status[x.TrangThai] || x.TrangThai}</span></td></tr>) : <tr><td colSpan="6" className="text-center text-muted py-4">Chưa có hóa đơn.</td></tr>}</tbody></table></div></div></div></div>;
};
export default PaymentHistoryPage;
