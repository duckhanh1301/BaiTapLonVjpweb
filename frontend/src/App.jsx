
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './page/Login';
import Dashboard from './page/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const token = localStorage.getItem('token');

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/" 
                    element={
                        token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
                    } 
                />
                {/* Route 404 - trang không tìm thấy */}
                <Route path="*" element={<h2 className="text-center mt-5">404 - Trang không tồn tại</h2>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;