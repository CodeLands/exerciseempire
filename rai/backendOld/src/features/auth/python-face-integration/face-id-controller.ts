import { Request, Response } from 'express';
import { UserModel } from '../user-model';
import axiosInstance from '../../../infrastructure/config/axios-config';

// Define custom request type to include file from multer
interface MulterRequest extends Request {
    file?: Express.Multer.File;
  }

  export const faceLogin = async (req: MulterRequest, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).send("Face data is required.");
        return;
    }

    try {
        const { userId } = req.body as { userId: number };
        const response = await axiosInstance.post(`/login-face?userId=${userId}`, req.file.buffer);

        if (response.data.recognized) {
            res.status(200).send("Face recognized. Login successful.");
        } else {
            res.status(401).send("Face not recognized. Access denied.");
        }
    } catch (error) {
        console.error('Face recognition error:', error);
        res.status(500).send("Error during face recognition.");
    }
};

export const faceRegister = async (req: MulterRequest, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).send("Video file is required for facial recognition registration.");
        return;
    }

    const { username } = req.body as { username: string };

    try {
        // Sending the video to the Python service for processing
        const response = await axiosInstance.post('/register-face', req.file.buffer, {
            params: { username }
        });

        // Update the database record to indicate the video has been processed
        const videoProcessedSuccess = response.data.success;

        if (videoProcessedSuccess) {
            await UserModel.updateVideoStatus(username, true);
            res.status(200).json({ success: true, message: "Video processing initiated and user status updated." });
        } else {
            await UserModel.updateVideoStatus(username, false);
            res.status(500).send("Failed to process video.");
        }
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).send("Error processing video.");
    }
};
