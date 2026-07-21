// frontend/src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Chưa đăng nhập → chuyển về login
        return <Navigate to="/login" replace />;
    }
    // Đã đăng nhập → hiển thị children (Dashboard, ...)
    return children;
};

export default PrivateRoute;