import axios from './axiosConfig';
export const getPayments = async () => (await axios.get('/payments')).data;
