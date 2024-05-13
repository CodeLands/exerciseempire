"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var axiosInstance = axios_1.default.create({
    baseURL: process.env.FLASK_SERVER_URL || 'http://localhost:5000',
    timeout: 5000, // 5000 milliseconds timeout
    headers: { 'Content-Type': 'application/octet-stream' }
});
exports.default = axiosInstance;
