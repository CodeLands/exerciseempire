import { z } from 'zod';

export const UserAuthSchema = z.object({
    id: z.number().int({
      message: "id must be an integer!"
    }),
    email: z.string({
      required_error: "email is required!"
    }).email({
      message: "email must be a valid email address!"
    }),
    pass_hash: z.string({
      required_error: "pass_hash is required!"
    }).min(50, {
      message: "pass_hash must be at least 50 characters long!"
    }).max(72, {
      message: "pass_hash must be at most 72 characters long!"
    }),
  });