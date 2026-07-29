// import { useEffect, useState } from 'react';
// import { getPayments } from '../services/paymentService';
// import '../styles/PaymentHistoryPage.css';
// const status = { ChoThanhToan: 'Chờ thanh toán', DaThanhToan: 'Đã thanh toán', QuaHan: 'Quá hạn', TuChoi: 'Từ chối' };
// const PaymentHistoryPage = () => {
//     const [payments, setPayments] = useState([]); const [error, setError] = useState('');
//     useEffect(() => { getPayments().then(setPayments).catch(() => setError('Không thể tải hóa đơn.')); }, []);
//     const money = x => Number(x || 0).toLocaleString('vi-VN') + ' đ';
//     return <div className="payment-history-page"><div className="container py-4"><h1 className="mb-4">Hóa đơn & thanh toán</h1>{error && <div className="alert alert-danger">{error}</div>}<div className="card"><div className="card-body table-responsive"><table className="table table-hover mb-0"><thead><tr><th>Kỳ thanh toán</th><th>Căn hộ</th><th>Số tiền</th><th>Hạn thanh toán</th><th>Ngày thanh toán</th><th>Trạng thái</th></tr></thead><tbody>{payments.length ? payments.map(x => <tr key={x.MaHoaDon}><td>{new Date(x.KyThanhToan).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })}</td><td>{x.TenCanHo}</td><td className="fw-bold">{money(x.SoTien)}</td><td>{new Date(x.HanThanhToan).toLocaleDateString('vi-VN')}</td><td>{x.NgayThanhToan ? new Date(x.NgayThanhToan).toLocaleDateString('vi-VN') : '--'}</td><td><span className="badge bg-secondary">{status[x.TrangThai] || x.TrangThai}</span></td></tr>) : <tr><td colSpan="6" className="text-center text-muted py-4">Chưa có hóa đơn.</td></tr>}</tbody></table></div></div></div></div>;
// };
// export default PaymentHistoryPage;
import { useEffect, useMemo, useState } from 'react';
import {
    FaBuilding,
    FaCalendarDays,
    FaCircleCheck,
    FaClock,
    FaReceipt,
    FaTriangleExclamation,
    FaWallet,
} from 'react-icons/fa6';
import { getPayments } from '../services/paymentService';
import '../styles/PaymentHistoryPage.css';

const paymentStatus = {
    ChoThanhToan: { label: 'Chờ thanh toán', className: 'is-pending' },
    DaThanhToan: { label: 'Đã thanh toán', className: 'is-paid' },
    QuaHan: { label: 'Quá hạn', className: 'is-overdue' },
    TuChoi: { label: 'Từ chối', className: 'is-rejected' },
};

const PaymentHistoryPage = () => {
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPayments()
            .then((data) => setPayments(Array.isArray(data) ? data : []))
            .catch(() => setError('Không thể tải danh sách hóa đơn.'))
            .finally(() => setLoading(false));
    }, []);

    const money = (value) => `${Number(value || 0).toLocaleString('vi-VN')} đ`;
    const date = (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '—';

    const summary = useMemo(() => payments.reduce((result, payment) => {
        const amount = Number(payment.SoTien || 0);
        result.total += amount;
        if (payment.TrangThai === 'DaThanhToan') result.paid += amount;
        if (payment.TrangThai === 'ChoThanhToan' || payment.TrangThai === 'QuaHan') {
            result.pending += amount;
        }
        if (payment.TrangThai === 'QuaHan') result.overdue += 1;
        return result;
    }, { total: 0, paid: 0, pending: 0, overdue: 0 }), [payments]);

    return (
        <div className="payment-history-page">
            <div className="payment-page-container">
                <header className="payment-page-header">
                    <div>
                        <span className="payment-eyebrow">Quản lý tài chính</span>
                        <h1>Hóa đơn & thanh toán</h1>
                        <p>Theo dõi các khoản phí, thời hạn và lịch sử thanh toán.</p>
                    </div>
                    <div className="payment-header-icon" aria-hidden="true"><FaWallet /></div>
                </header>

                {error && (
                    <div className="payment-alert" role="alert">
                        <FaTriangleExclamation aria-hidden="true" />
                        <span><strong>Không thể tải dữ liệu</strong>{error}</span>
                    </div>
                )}

                {!error && (
                    <>
                        <section className="payment-summary-grid" aria-label="Tổng quan thanh toán">
                            <article className="payment-summary-card is-total">
                                <span><FaReceipt aria-hidden="true" /></span>
<div><p>Tổng giá trị hóa đơn</p><strong>{money(summary.total)}</strong></div>
                            </article>
                            <article className="payment-summary-card is-paid">
                                <span><FaCircleCheck aria-hidden="true" /></span>
                                <div><p>Đã thanh toán</p><strong>{money(summary.paid)}</strong></div>
                            </article>
                            <article className="payment-summary-card is-pending">
                                <span><FaClock aria-hidden="true" /></span>
                                <div><p>Cần thanh toán</p><strong>{money(summary.pending)}</strong></div>
                            </article>
                            <article className="payment-summary-card is-overdue">
                                <span><FaTriangleExclamation aria-hidden="true" /></span>
                                <div><p>Hóa đơn quá hạn</p><strong>{summary.overdue}</strong></div>
                            </article>
                        </section>

                        <section className="payment-table-card">
                            <div className="payment-table-heading">
                                <div>
                                    <span>Lịch sử giao dịch</span>
                                    <h2>Danh sách hóa đơn</h2>
                                </div>
                                <strong>{payments.length} hóa đơn</strong>
                            </div>

                            <div className="payment-table-wrap">
                                <table className="payment-table">
                                    <thead>
                                        <tr>
                                            <th>Kỳ thanh toán</th>
                                            <th>Căn hộ</th>
                                            <th>Số tiền</th>
                                            <th>Hạn thanh toán</th>
                                            <th>Ngày thanh toán</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="6">
                                                    <div className="payment-empty-state" role="status">
                                                        <span className="payment-spinner" aria-hidden="true" />
                                                        <p>Đang tải hóa đơn...</p>
                                                    </div>
                                                </td>
                                            </tr>
) : payments.length ? payments.map((payment) => {
                                            const currentStatus = paymentStatus[payment.TrangThai] || {
                                                label: payment.TrangThai || 'Chưa cập nhật',
                                                className: 'is-unknown',
                                            };

                                            return (
                                                <tr key={payment.MaHoaDon}>
                                                    <td data-label="Kỳ thanh toán">
                                                        <span className="payment-period">
                                                            <FaCalendarDays aria-hidden="true" />
                                                            {new Date(payment.KyThanhToan).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })}
                                                        </span>
                                                    </td>
                                                    <td data-label="Căn hộ">
                                                        <span className="payment-apartment">
                                                            <FaBuilding aria-hidden="true" />
                                                            {payment.TenCanHo || '—'}
                                                        </span>
                                                    </td>
                                                    <td data-label="Số tiền" className="payment-amount">{money(payment.SoTien)}</td>
                                                    <td data-label="Hạn thanh toán">{date(payment.HanThanhToan)}</td>
                                                    <td data-label="Ngày thanh toán">{date(payment.NgayThanhToan)}</td>
                                                    <td data-label="Trạng thái">
                                                        <span className={`payment-status ${currentStatus.className}`}>
                                                            <i aria-hidden="true" /> {currentStatus.label}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr>
                                                <td colSpan="6">
                                                    <div className="payment-empty-state">
                                                        <FaReceipt aria-hidden="true" />
                                                        <strong>Chưa có hóa đơn</strong>
                                                        <p>Hóa đơn của bạn sẽ được hiển thị tại đây.</p>
</div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentHistoryPage;