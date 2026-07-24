import axios from "axios";

const API_URL = "http://localhost:3000/api/buildings";

// Lấy tất cả
export const getAllBuildings = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

// Lấy theo id
export const getBuildingById = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
};

// Thêm
export const createBuilding = async (data) => {
    const res = await axios.post(API_URL, data);
    return res.data;
};

// Cập nhật
export const updateBuilding = async (id, data) => {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
};

// Xóa
export const deleteBuilding = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};

// Tìm kiếm
export const searchBuildings = async (keyword) => {
    const res = await axios.get(
        `${API_URL}/search?keyword=${keyword}`
    );
    return res.data;
};