import axios from 'axios';

// const API_URL = 'http://localhost:3001/api/auth';
const API_URL = 'http://192.168.0.104:3001/api/auth';

export const authEmployee = async (username, password) => {
    const res = await axios.post(API_URL, { username, password });
    return res.data;
};