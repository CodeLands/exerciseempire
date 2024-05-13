import { Request, Response } from 'express';
const axios = require('axios').create({
    timeout: 5000,  // 5000 milliseconds timeout
  });

const FLASK_SERVER_URL = process.env.FLASK_SERVER_URL || 'http://localhost:5000';

// Define custom request type to include file from multer
interface MulterRequest extends Request {
    file?: Express.Multer.File;
  }

  export const faceLogin = async (req: MulterRequest, res: Response) => {
    if (!req.file) {  // Check if the file is undefined
        return res.status(400).json({ error: 'Video file is required' });
    }
    
    try {
        // Convert the file buffer to a suitable format, e.g., base64, for transmission
        const videoData = req.file.buffer.toString('base64'); // Adjust if necessary based on your needs
        const response = await axios.post(`${FLASK_SERVER_URL}/face-login`, {
            video: videoData
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data.authenticated) {
            return res.json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: "Authentication failed" });
        }
    } catch (error) {
        console.error('Error during facial recognition login:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const faceRegister = async (req: MulterRequest, res: Response) =>{
    if (!req.file) {
        return res.status(400).json({ message: 'No video uploaded!' });
    }

    try {
        const response = await axios.post('http://localhost:5000/register-face', req.file.buffer, {
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });
        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error('Error sending video to Flask:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};