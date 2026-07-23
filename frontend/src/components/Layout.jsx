
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { logout, getCurrentUser } from '../services/authService';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Layout = ({ children }) => {
//     const navigate = useNavigate();
//     const user = getCurrentUser();
//     const [sidebarOpen, setSidebarOpen] = useState(true);

//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };

//     return (
//         <div className="d-flex" style={{ minHeight: '100vh' }}>
//             {/* Sidebar */}
//             <div 
//                 className="bg-dark text-white p-3" 
//                 style={{ 
//                     width: sidebarOpen ? '250px' : '70px', 
//                     transition: 'width 0.3s',
//                     flexShrink: 0
//                 }}
//             >
//                 <div className="d-flex justify-content-between align-items-center mb-4">
//                     <h5 className={sidebarOpen ? '' : 'd-none'}>🏠 Quản lý</h5>
//                     <button 
//                         className="btn btn-sm btn-outline-light" 
//                         onClick={() => setSidebarOpen(!sidebarOpen)}
//                     >
//                         {sidebarOpen ? '◀' : '▶'}
//                     </button>
//                 </div>
//                 <ul className="nav flex-column">
//                     <li className="nav-item">
//                         <a className="nav-link text-white" href="/dashboard">
//                             📊 Dashboard
//                         </a>
//                     </li>
//                     <li className="nav-item">
//                         <a className="nav-link text-white" href="#">
//                             🏢 Tòa nhà
//                         </a>
//                     </li>
//                     <li className="nav-item">
//                         <a className="nav-link text-white" href="#">
//                             🏠 Căn hộ
//                         </a>
//                     </li>
//                     <li className="nav-item">
//                         <a className="nav-link text-white" href="#">
//                             👤 Người thuê
//                         </a>
//                     </li>
//                     <li className="nav-item">
//                         <a className="nav-link text-white" href="#">
//                             📄 Hợp đồng
//                         </a>
//                     </li>
//                 </ul>
//                 <div className="mt-auto pt-3 border-top border-secondary">
//                     <div className="text-muted small">
//                         {user?.email}
//                     </div>
//                     <button 
//                         className="btn btn-sm btn-outline-danger w-100 mt-2" 
//                         onClick={handleLogout}
//                     >
//                         Đăng xuất
//                     </button>
//                 </div>
//             </div>

//             {/* Nội dung chính */}
//             <div className="flex-grow-1 p-4 bg-light">
//                 {children}
//             </div>
//         </div>
//     );
// };

// export default Layout;
// frontend/src/components/Layout.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/authService';
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const isAdmin = user?.role === 'Admin';
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            {/* Sidebar */}
            <div 
                className="bg-dark text-white p-3" 
                style={{ 
                    width: sidebarOpen ? '250px' : '70px', 
                    transition: 'width 0.3s',
                    flexShrink: 0,
                    position: 'relative'
                }}
            >
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className={sidebarOpen ? '' : 'd-none'}>🏠 Quản lý</h5>
                    <button 
                        className="btn btn-sm btn-outline-light" 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                </div>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <a className="nav-link text-white" href="/dashboard">
                            📊 Dashboard
                        </a>
                    </li>
                    
                    {/* Chỉ Admin mới thấy các menu quản lý */}
                    {isAdmin && (
                        <>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#">
                                    🏢 Tòa nhà
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#">
                                    🏠 Căn hộ
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#">
                                    👤 Người thuê
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#">
                                    📄 Hợp đồng
                                </a>
                            </li>
                        </>
                    )}
                    
                    {/* Nếu là Nhân viên, chỉ hiển thị một số menu (ví dụ chỉ Dashboard) */}
                    {!isAdmin && (
                        <li className="nav-item">
                            <a className="nav-link text-white" href="#" style={{ opacity: 0.5 }}>
                                👤 Thông tin của tôi
                            </a>
                        </li>
                    )}
                </ul>
                <div className="mt-auto pt-3 border-top border-secondary">
                    <div className="text-muted small">
                        {user?.email} <br />
                        <span className="badge bg-info">{user?.role}</span>
                    </div>
                    <button 
                        className="btn btn-sm btn-outline-danger w-100 mt-2" 
                        onClick={handleLogout}
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>

            {/* Nội dung chính */}
            <div className="flex-grow-1 p-4 bg-light">
                {children}
            </div>
        </div>
    );
};

export default Layout;