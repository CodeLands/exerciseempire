import { Request, Response } from 'express';
import { UserModel } from './user-model';
import axios from 'axios';
import bcrypt from 'bcrypt';

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
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body as { username: string; password: string };

  try {
      const user = await UserModel.findByUsername(username);
      if (!user) {
          res.status(404).send("User not found.");
          return;
      }

      const isValid = await bcrypt.compare(password, user.pass_hash);
      if (!isValid) {
          res.status(401).send("Invalid password.");
          return;
      }

      // If credentials are valid, instruct the client to proceed with face recognition
      res.status(200).json({ message: "Credentials validated, proceed with face recognition.", userId: user.id });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).send("Error during login.");
  }
};