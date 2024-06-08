import {injectable} from 'inversify';
import z from 'zod';
import { ValidationResult } from '/App/Types/ValidatorTypes';

export type FaceIdData = {
  video: string;
};

export type FaceIdValidateResult = {
  success: boolean;
  message: string;
  wasRecognized: boolean;
};

export type FaceIdSetupResult = {
  success: boolean;
  message: string;
  wasSetup: boolean;
};

@injectable()
export class FaceIdValidator {
  public FaceDataValidate = (video: string): ValidationResult<FaceIdData> => {
    const schema = z.object({
      video: z.string({
        required_error: "Video is required"
      }),
    });

    const validationResult = schema.safeParse({video});

    if (!validationResult.success) {
        return { success: false, errors: validationResult.error.errors };
    } else {
        return { success: true, data: validationResult.data };
    }
  }

  public FaceResultValidate = (success: boolean, message: string, wasRecognized: boolean): ValidationResult<FaceIdValidateResult> => {
    const schema = z.object({
      success: z.boolean({
          required_error: "Face recognition success is required"
      }),
      message: z.string({
          required_error: "Face recognition message is required"
      }),
      wasRecognized: z.boolean({
          required_error: "Face recognition result is required"
      })
    });

    const validationResult = schema.safeParse({success, message, wasRecognized});

    if (!validationResult.success) {
        return { success: false, errors: validationResult.error.errors };
    } else {
        return { success: true, data: validationResult.data };
    }
  }

  public FaceResultSetup = (success: boolean, message: string, wasSetup: boolean): ValidationResult<FaceIdSetupResult> => {
    const schema = z.object({
      success: z.boolean({
          required_error: "Face recognition success is required"
      }),
      message: z.string({
          required_error: "Face recognition message is required"
      }),
      wasSetup: z.boolean({
          required_error: "Face recognition setup result is required"
      })
    });

    const validationResult = schema.safeParse({success, message, wasSetup});

    if (!validationResult.success) {
        return { success: false, errors: validationResult.error.errors };
    } else {
        return { success: true, data: validationResult.data };
    }
  }
}