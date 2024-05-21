import { ZodIssue } from "zod";

type ValidationResultSuccess<T> = {
    success: true;
    data: T;
  };
  
  type ValidationResultError = {
    success: false;
    errors: ZodIssue[];
  };
  
export type ValidationResult<T> = ValidationResultSuccess<T> | ValidationResultError;
  