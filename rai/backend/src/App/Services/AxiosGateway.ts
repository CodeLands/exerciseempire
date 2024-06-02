import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.FLASK_SERVER_URL || 'http://localhost:5000',
    timeout: 30000, // 30 seconds timeout
    headers: { 'Content-Type': 'application/octet-stream' }
});

export default axiosInstance;