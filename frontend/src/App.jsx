
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
            </Routes>
        </BrowserRouter>
    );
}

export default App;