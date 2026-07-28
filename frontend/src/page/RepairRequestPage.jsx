import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createRepair, getRepairs } from '../services/repairService';
import '../styles/RepairRequestPage.css';

const labels = { ChoXuLy: 'Chờ xử lý', DangXuLy: 'Đang xử lý', HoanThanh: 'Hoàn thành', TuChoi: 'Từ chối' };
const RepairRequestPage = () => {
    const [form, setForm] = useState({ repairType: '', description: '', urgentLevel: 'BinhThuong' });
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const load = async () => { try { setItems(await getRepairs()); } catch { toast.error('Không thể tải yêu cầu sửa chữa.'); } };
    useEffect(() => { load(); }, []);
    const submit = async (event) => { event.preventDefault(); if (!form.repairType || !form.description.trim()) return toast.error('Vui lòng nhập loại sự cố và mô tả.'); try { setLoading(true); await createRepair(form); setForm({ repairType: '', description: '', urgentLevel: 'BinhThuong' }); toast.success('Đã gửi yêu cầu sửa chữa.'); load(); } catch (error) { toast.error(error.response?.data?.message || 'Gửi yêu cầu thất bại.'); } finally { setLoading(false); } };
    return <div className="repair-request-page"><div className="container py-4"><h1 className="mb-4">Yêu cầu sửa chữa</h1><div className="row"><div className="col-md-6 mb-4"><div className="card repair-form-card"><div className="card-header bg-primary text-white"><h5 className="mb-0">Gửi yêu cầu</h5></div><div className="card-body"><form onSubmit={submit}><label className="form-label">Loại sự cố</label><input className="form-control mb-3" value={form.repairType} onChange={e => setForm({ ...form, repairType: e.target.value })} placeholder="Ví dụ: Điều hòa hỏng" required /><label className="form-label">Mô tả</label><textarea className="form-control mb-3" rows="4" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /><label className="form-label">Mức độ ưu tiên</label><select className="form-select mb-3" value={form.urgentLevel} onChange={e => setForm({ ...form, urgentLevel: e.target.value })}><option value="BinhThuong">Bình thường</option><option value="KhanCap">Khẩn cấp</option><option value="RatKhanCap">Rất khẩn cấp</option></select><button className="btn btn-primary w-100" disabled={loading}>{loading ? 'Đang gửi...' : 'Gửi yêu cầu'}</button></form></div></div></div><div className="col-md-6"><div className="card"><div className="card-header"><h5 className="mb-0">Lịch sử yêu cầu</h5></div><div className="card-body">{items.length ? items.map(x => <div key={x.MaYeuCau} className="border-bottom pb-3 mb-3"><div className="d-flex justify-content-between"><strong>{x.LoaiSuCo}</strong><span className="badge bg-secondary">{labels[x.TrangThai]}</span></div><p className="mb-1 mt-2">{x.MoTa}</p><small className="text-muted">{new Date(x.NgayTao).toLocaleString('vi-VN')}</small>{x.GhiChuXuLy && <p className="mb-0 mt-2 text-info">Phản hồi: {x.GhiChuXuLy}</p>}</div>) : <p className="text-muted mb-0">Chưa có yêu cầu nào.</p>}</div></div></div></div></div></div>;
};
export default RepairRequestPage;
