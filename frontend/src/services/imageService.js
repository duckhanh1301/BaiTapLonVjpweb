import axios from "axios";

const API_URL = "http://localhost:3000/api/images";

export const uploadImage = async (formData) => {
    const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
};

export const getImages = async (maCanHo) => {
    const res = await axios.get(`${API_URL}/${maCanHo}`);
    return res.data;
};

export const deleteImage = async (maAnh) => {
    const res = await axios.delete(`${API_URL}/${maAnh}`);
    return res.data;
};
