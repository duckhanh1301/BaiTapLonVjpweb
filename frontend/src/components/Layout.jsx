// import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { logout, getCurrentUser } from '../services/authService';
// import Header from './Header';
// import { navigationItems } from './navigation';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Layout = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const user = getCurrentUser();
//     const currentPage = navigationItems.find(
//         (item) => (
//             item.path === location.pathname
//             || location.pathname.startsWith(`${item.path}/`)
//         ),
//     ) ?? navigationItems[0];
//     const PageIcon = currentPage.icon;
//     const displayName = (
//         user?.name
//         || user?.fullName
//         || user?.username
//         || user?.HoTen
//         || user?.email?.split('@')[0]
//         || 'Người dùng'
//     );

//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };

//     return (
//         <div className="layout">
//             <Header user={user} handleLogout={handleLogout} />

//             <header className="page-header">
//                 <PageIcon aria-hidden="true" />
//                 <div>
//                     <h1>{currentPage.label}</h1>
//                     <p>
//                         Xin chào, <strong>{displayName}</strong>
//                         {user?.role && <> (<strong>{user.role}</strong>)</>}
//                     </p>
//                 </div>
//             </header>

//             <main className="layout-content">
//                 <Outlet />
//             </main>
//         </div>
//     );
// };

// export default Layout;


// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Header from './Header';
// import '../styles/Layout.css';

// function Layout() {
//     const user = JSON.parse(localStorage.getItem('user'));
//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         window.location.href = '/login';
//     };

//     return (
//         <div className="layout-container">
//             <Header user={user} handleLogout={handleLogout} />
//             <main className="layout-main">
//                 <div className="layout-content">
//                     <Outlet />
//                 </div>
//             </main>
//         </div>
//     );
// }

// export default Layout;


import { Outlet } from 'react-router-dom';
import Header from './Header';
import '../styles/Layout.css';

function Layout() {
    const user = JSON.parse(localStorage.getItem('user'));
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="layout-container">
            <Header user={user} handleLogout={handleLogout} />
            <main className="layout-main">
                <div className="layout-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default Layout;
