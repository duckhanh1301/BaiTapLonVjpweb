import axios from "./axiosConfig";

const API_URL = "/tenants";

export const getAllTenants = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const updateTenant = async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
};

export const deleteTenant = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
