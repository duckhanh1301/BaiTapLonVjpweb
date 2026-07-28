import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerTenant } from '../services/authService';
import './Register.css';

const Register = () => {
    const [form, setForm] = useState({ fullName: '', phone: '', citizenId: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        try {
            await registerTenant(form);
            navigate('/login', { replace: true, state: { message: 'Đăng ký thành công. Hãy đăng nhập để tiếp tục.' } });
        } catch (err) {
            setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally { setLoading(false); }
    };

    return <main className="auth-page"><section className="auth-card" aria-labelledby="register-title">
        <div className="auth-icon" aria-hidden="true">⌂</div>
        <p className="auth-eyebrow">QUẢN LÝ NHÀ CHO THUÊ</p>
        <h1 id="register-title">Tạo tài khoản người thuê</h1>
        <p className="auth-description">Điền thông tin để tạo hồ sơ và theo dõi căn hộ, hợp đồng của bạn.</p>
        <form onSubmit={handleSubmit}>
            <label htmlFor="fullName">Họ và tên</label><input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Nguyễn Văn A" autoComplete="name" required />
            <div className="auth-two-columns"><div><label htmlFor="phone">Số điện thoại</label><input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="0901234567" autoComplete="tel" required /></div><div><label htmlFor="citizenId">CCCD</label><input id="citizenId" name="citizenId" value={form.citizenId} onChange={handleChange} placeholder="012345678901" inputMode="numeric" required /></div></div>
            <label htmlFor="email">Email</label><input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="nhanvien@gmail.com" autoComplete="email" required />
            <label htmlFor="password">Mật khẩu</label><input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Tối thiểu 6 ký tự" autoComplete="new-password" minLength="6" required />
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label><input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Nhập lại mật khẩu" autoComplete="new-password" minLength="6" required />
            {error && <p className="auth-error" role="alert">{error}</p>}<button type="submit" disabled={loading}>{loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}</button>
        </form>
        <p className="auth-switch">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
    </section></main>;
};

export default Register;
