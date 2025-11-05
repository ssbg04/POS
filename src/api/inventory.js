import axios from "axios";

const API_URL = "http://localhost:3001/api/inventory";

export const getInventoryLogsAPI = async (product_id) => {
    const res = await axios.get(API_URL, { params: { product_id } });
    return res.data;
};

export const createInventoryLogAPI = async (log) => {
    const res = await axios.post(API_URL, log);
    return res.data;
};
