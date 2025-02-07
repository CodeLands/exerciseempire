import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.FLASK_SERVER_URL || 'http://localhost:4000',
    timeout: 600000, // 30 seconds timeout
    headers: { 'Content-Type': 'application/octet-stream' }
});

export default axiosInstance;