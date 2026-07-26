import axios from "./axiosConfig";

export const uploadImage = async (formData) => {
    const res = await axios.post("/images/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
};

export const getImages = async (maCanHo) => {
    const res = await axios.get(`/images/${maCanHo}`);
    return res.data;
};

export const deleteImage = async (maAnh) => {
    const res = await axios.delete(`/images/${maAnh}`);
    return res.data;
};
