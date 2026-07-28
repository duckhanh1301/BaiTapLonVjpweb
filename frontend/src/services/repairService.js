import axios from './axiosConfig';
export const getRepairs = async () => (await axios.get('/repairs')).data;
export const createRepair = async (data) => (await axios.post('/repairs', data)).data;
