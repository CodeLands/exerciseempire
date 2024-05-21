import {injectable} from 'inversify';
import z, { ZodIssue } from 'zod';

type ValidationResultSuccess<T> = {
  success: true;
  data: T;
};

type ValidationResultError = {
  success: false;
  errors: ZodIssue[];
};

type ValidationResult<T> = ValidationResultSuccess<T> | ValidationResultError;

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  repeatPassword: string;
};

@injectable()
export class AuthValidator {
  public loginDataValidate = (email: string, password: string): ValidationResult<LoginData> => {
    const schema = z.object({
      email: z.string().email({ message: "Invalid email address" }),
      password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    });

    const validationResult = schema.safeParse({email, password});

    if (!validationResult.success) {
        return { success: false, errors: validationResult.error.errors };
    } else {
        return { success: true, data: validationResult.data };
    }
}

  public registerDataValidate = (email: string, password: string, repeatPassword: string): ValidationResult<RegisterData> => {
    const schema = z.object({
      email: z.string().email({ message: "Invalid email address" }),
      password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
      repeatPassword: z.string().min(8, { message: "Password must be at least 8 characters long" })
    }).refine((data) => data.password === data.repeatPassword, {
        message: "Passwords do not match",
        path: ["repeatPassword"], // Path to the field that should show the error
      });

    const validationResult = schema.safeParse({email, password, repeatPassword});

    if (!validationResult.success) {
        return { success: false, errors: validationResult.error.errors };
    } else {
        return { success: true, data: validationResult.data };
    }
  }
}