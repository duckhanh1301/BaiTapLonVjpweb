import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const user = getCurrentUser();

    // Nếu không có token hoặc không có user, chuyển về login
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;