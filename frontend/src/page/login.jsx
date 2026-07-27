// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { login } from '../services/authService';

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');
//         try {
//             const data = await login(email, password);
//             navigate(
//                 data.user?.role === 'ChuThue'
//                     ? '/dashboard'
//                     : '/apartments',
//                 { replace: true },
//             );
//         } catch (err) {
//             setError(err.message || 'Đăng nhập thất bại');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container d-flex justify-content-center align-items-center vh-100">
//             <div className="card shadow-lg p-4" style={{ width: '400px' }}>
//                 <h3 className="text-center mb-4">Đăng nhập</h3>
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-3">
//                         <label className="form-label">Email</label>
//                         <input
//                             type="email"
//                             className="form-control"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             placeholder="admin@gmail.com"
//                             required
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label className="form-label">Mật khẩu</label>
//                         <input
//                             type="password"
//                             className="form-control"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             placeholder="123456"
//                             required
//                         />
//                     </div>
//                     {error && <div className="alert alert-danger">{error}</div>}
//                     <button
//                         type="submit"
//                         className="btn btn-primary w-100"
//                         disabled={loading}
//                     >
//                         {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Login;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    // Danh sách ảnh slideshow (URL ảnh căn hộ)
    const images = [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await login(email, password);
            navigate(
                data.user?.role === 'ChuThue'
                    ? '/dashboard'
                    : '/apartments',
                { replace: true }
            );
        } catch (err) {
            setError(err.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center p-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="row w-100 h-100 m-0 shadow-lg" style={{ maxWidth: '1200px', borderRadius: '24px', overflow: 'hidden' }}>
                {/* Cột bên trái: Slideshow ảnh (chỉ ảnh, không chữ) */}
                <div className="col-lg-7 d-none d-lg-block p-0 position-relative" style={{ height: '100%' }}>
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className="position-absolute w-100 h-100"
                            style={{
                                backgroundImage: `url(${img})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                opacity: currentImageIndex === index ? 1 : 0,
                                transition: 'opacity 1.2s ease-in-out',
                                zIndex: currentImageIndex === index ? 1 : 0,
                            }}
                        />
                    ))}
                    {/* Chỉ báo vị trí ảnh (dots) */}
                    <div className="position-absolute bottom-0 w-100 d-flex justify-content-center pb-4" style={{ zIndex: 3 }}>
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                className="btn btn-sm rounded-circle mx-1 p-0"
                                style={{
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: currentImageIndex === idx ? '#fff' : 'rgba(255,255,255,0.5)',
                                    border: 'none',
                                    transition: 'all 0.3s',
                                }}
                                onClick={() => setCurrentImageIndex(idx)}
                            />
                        ))}
                    </div>
                </div>

                {/* Cột bên phải: Form đăng nhập (có thêm phần giới thiệu) */}
                <div className="col-lg-5 d-flex align-items-center justify-content-center p-5" style={{ backgroundColor: '#fff', height: '100%' }}>
                    <div className="w-100" style={{ maxWidth: '420px' }}>
                        {/* Phần giới thiệu (được chuyển từ ảnh sang đây) */}
                        <div className="text-center mb-4" style={{ animation: 'fadeIn 1s ease' }}>
                            <h1 className="display-4 fw-bold" style={{ color: '#333' }}>🏠 Nhà Cho Thuê</h1>
                            <div className="border-bottom border-secondary w-25 mx-auto my-3" style={{ opacity: 0.3 }}></div>
                            <p className="lead text-muted" style={{ fontSize: '1.1rem' }}>
                                Quản lý căn hộ, hợp đồng và người thuê <br />
                                <span className="fw-bold" style={{ color: '#764ba2' }}>dễ dàng & hiệu quả</span>
                            </p>
                            <div className="mt-3">
                                <span className="badge bg-light text-dark me-2 p-2 px-3 rounded-pill shadow-sm">🔑 An toàn</span>
                                <span className="badge bg-light text-dark me-2 p-2 px-3 rounded-pill shadow-sm">📊 Thống kê</span>
                                <span className="badge bg-light text-dark p-2 px-3 rounded-pill shadow-sm">📄 Báo cáo</span>
                            </div>
                        </div>

                        {/* Form đăng nhập */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Email</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0">
                                        <i className="bi bi-envelope"></i>
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg border-0 bg-light"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@gmail.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Mật khẩu</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0">
                                        <i className="bi bi-lock"></i>
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg border-0 bg-light"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="123456"
                                        required
                                    />
                                </div>
                            </div>
                            {error && <div className="alert alert-danger py-2">{error}</div>}
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-100 mt-2"
                                disabled={loading}
                                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                ) : null}
                                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </button>
                        </form>
                        <div className="mt-3 text-center">
                            <small className="text-muted">Chưa có tài khoản? <a href="/register" className="text-decoration-none" style={{ color: '#764ba2' }}>Đăng ký ngay</a></small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Style cho hiệu ứng fadeIn */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Login;