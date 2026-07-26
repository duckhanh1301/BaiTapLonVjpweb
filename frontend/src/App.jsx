
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './page/login';
import Dashboard from './page/Dashboard';
import SectionPage from './page/SectionPage';
import PrivateRoute from './components/PrivateRoute';
import BuildingPage from "./page/BuildingPage";
import ApartmentPage from "./page/ApartmentPage";
import TenantPage from "./page/TenantPage";
import ContractPage from "./page/ContractPage";
import Layout from './components/Layout';
import { getCurrentUser } from './services/authService';
import 'bootstrap/dist/css/bootstrap.min.css';

const OwnerRoute = ({ children }) => (
    <PrivateRoute allowedRoles={['ChuThue']}>
        {children}
    </PrivateRoute>
);

function App() {
    const token = localStorage.getItem('token');
    const user = getCurrentUser();
    const homePath = user?.role === 'ChuThue'
        ? '/dashboard'
        : '/profile';

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
                    <Route
                        path="/dashboard"
                        element={<OwnerRoute><Dashboard /></OwnerRoute>}
                    />
                    <Route
                        path="/apartments"
                        element={<OwnerRoute><ApartmentPage /></OwnerRoute>}
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
                        element={<OwnerRoute><ContractPage /></OwnerRoute>}
                    />
                    <Route path="/profile" element={<SectionPage name="Cá Nhân" />} />
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
