import { Request, Response } from 'express';
import { UserModel } from './user-model';
import axios from 'axios';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body as { username: string; email: string; password: string };

  try {
    // Optionally, send a preliminary request to the Python server to confirm readiness or validate the session
    const videoProcessResponse = await axios.get('http://localhost:5000/face-register-status', {
      params: { username: username }
    });

    if (videoProcessResponse.data.success) {
      const newUser = await UserModel.create({ username, email, password });
      res.status(201).json(newUser);
    } else {
      res.status(500).send("Failed to process video or video not yet uploaded.");
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send("Error during registration.");
  }
};
export const login = async (req: Request, res: Response) => {
  // Handle login logic
  res.status(200).send("Login successful.");
};

