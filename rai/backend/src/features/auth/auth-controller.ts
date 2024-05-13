import { Request, Response } from 'express';


export const register = async (req: Request, res: Response) => {
  // Handle registration logic
  res.status(201).send("Registered successfully.");
};

export const login = async (req: Request, res: Response) => {
  // Handle login logic
  res.status(200).send("Login successful.");
};

