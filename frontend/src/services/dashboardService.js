
// import axios from 'axios';

// const API_URL = 'http://localhost:3000/api/dashboard';

// // Lấy token từ localStorage
// const getAuthHeader = () => ({
//     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
// });

// export const getSummary = async () => {
//     const response = await axios.get(`${API_URL}/summary`, getAuthHeader());
//     return response.data;
// };
// export const getRevenueByMonth = async () => {
//     const response = await axios.get(`${API_URL}/revenue-by-month`, getAuthHeader());
//     return response.data;
// };

// export const getApartmentStatus = async () => {
//     const response = await axios.get(`${API_URL}/apartment-status`, getAuthHeader());
//     return response.data;
// };

// export const getRevenueByBuilding = async () => {
//     const response = await axios.get(`${API_URL}/revenue-by-building`, getAuthHeader());
//     return response.data;
// };
// frontend/src/services/dashboardService.js
import axiosInstance from './axiosConfig';

export const getSummary = async () => {
    const response = await axiosInstance.get('/dashboard/summary');
    return response.data;
};

export const getRevenueByMonth = async () => {
    const response = await axiosInstance.get('/dashboard/revenue-by-month');
    return response.data;
};

export const getApartmentStatus = async () => {
    const response = await axiosInstance.get('/dashboard/apartment-status');
    return response.data;
};

export const getRevenueByBuilding = async () => {
    const response = await axiosInstance.get('/dashboard/revenue-by-building');
    return response.data;
};