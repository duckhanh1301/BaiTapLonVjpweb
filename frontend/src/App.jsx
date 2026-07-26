
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './page/login';
import Dashboard from './page/Dashboard';
import SectionPage from './page/SectionPage';
import PrivateRoute from './components/PrivateRoute';
import BuildingPage from "./page/BuildingPage";
import ApartmentPage from "./page/ApartmentPage";
import TenantPage from "./page/TenantPage";
import ContractPage from "./page/ContractPage";
import UserApartmentPage from "./page/UserApartmentPage";
import MyContractsPage from "./page/MyContractsPage";
import UserProfilePage from "./page/UserProfilePage";
import ChangePasswordPage from "./page/ChangePasswordPage";
import RepairRequestPage from "./page/RepairRequestPage";
import PaymentHistoryPage from "./page/PaymentHistoryPage";
import NotificationsPage from "./page/NotificationsPage";
import Layout from './components/Layout';
import { getCurrentUser } from './services/authService';
import 'bootstrap/dist/css/bootstrap.min.css';

const OwnerRoute = ({ children }) => (
    <PrivateRoute allowedRoles={['ChuThue']}>
        {children}
    </PrivateRoute>
);

const UserRoute = ({ children }) => (
    <PrivateRoute allowedRoles={['NguoiThue']}>
        {children}
    </PrivateRoute>
);

function App() {
    const token = localStorage.getItem('token');
    const user = getCurrentUser();
    const homePath = user?.role === 'ChuThue'
        ? '/dashboard'
        : user?.role === 'NguoiThue'
            ? '/apartments'
            : '/login';

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    element={
                        <PrivateRoute>
                            <Layout />
                        </PrivateRoute>
                    }
                >
                    {/* Admin Routes */}
                    <Route
                        path="/dashboard"
                        element={<OwnerRoute><Dashboard /></OwnerRoute>}
                    />
                    <Route
                        path="/apartments"
                        element={user?.role === 'ChuThue' ? <OwnerRoute><ApartmentPage /></OwnerRoute> : <UserRoute><UserApartmentPage /></UserRoute>}
                    />
                    <Route
                        path="/buildings"
                        element={<OwnerRoute><BuildingPage /></OwnerRoute>}
                    />
                    <Route
                        path="/tenants"
                        element={<OwnerRoute><TenantPage /></OwnerRoute>}
                    />
                    <Route
                        path="/contracts"
                        element={user?.role === 'ChuThue' ? <OwnerRoute><ContractPage /></OwnerRoute> : <UserRoute><MyContractsPage /></UserRoute>}
                    />
                    
                    {/* User Routes */}
                    <Route
                        path="/my-contracts"
                        element={<UserRoute><MyContractsPage /></UserRoute>}
                    />
                    <Route
                        path="/profile"
                        element={user?.role === 'NguoiThue' ? <UserRoute><UserProfilePage /></UserRoute> : <SectionPage name="Cá Nhân" />}
                    />
                    <Route
                        path="/change-password"
                        element={<PrivateRoute><ChangePasswordPage /></PrivateRoute>}
                    />
                    <Route
                        path="/repair-request"
                        element={<UserRoute><RepairRequestPage /></UserRoute>}
                    />
                    <Route
                        path="/payment-history"
                        element={<UserRoute><PaymentHistoryPage /></UserRoute>}
                    />
                    <Route
                        path="/notifications"
                        element={<PrivateRoute><NotificationsPage /></PrivateRoute>}
                    />
                </Route>
                <Route 
                    path="/" 
                    element={
                        token
                            ? <Navigate to={homePath} replace />
                            : <Navigate to="/login" replace />
                    } 
                />
                {/* Route 404 - trang không tìm thấy */}
                <Route path="*" element={<h2 className="text-center mt-5">404 - Trang không tồn tại</h2>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
