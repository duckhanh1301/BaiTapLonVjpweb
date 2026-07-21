// frontend/src/services/dashboardService.js
// import axios from 'axios';

// const API_URL = 'http://localhost:3000/api/dashboard';

// // Lấy token từ localStorage
// const getAuthHeader = () => ({
//     headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`
//     }
// });

// // API lấy thống kê tổng quan
// export const getDashboardSummary = async () => {
//     try {
//         const response = await axios.get(`${API_URL}/summary`, getAuthHeader());
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || { message: 'Lỗi khi lấy dữ liệu thống kê' };
//     }
// };
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/dashboard';

// Lấy token từ localStorage
const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getSummary = async () => {
    const response = await axios.get(`${API_URL}/summary`, getAuthHeader());
    return response.data;
};