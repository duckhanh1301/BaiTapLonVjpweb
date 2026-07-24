import axios from "axios";

const API_URL = "http://localhost:3000/api/apartments";

// Lấy tất cả căn hộ
export const getAllApartments = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

// Lấy căn hộ theo id
export const getApartmentById = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
};

// Thêm căn hộ
export const createApartment = async (data) => {
    const res = await axios.post(API_URL, data);
    return res.data;
};

// Cập nhật căn hộ
export const updateApartment = async (id, data) => {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
};

// Xóa căn hộ
export const deleteApartment = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};

// Tìm kiếm căn hộ
export const searchApartments = async (keyword) => {
    const res = await axios.get(`${API_URL}/search?keyword=${keyword}`);
    return res.data;
};
