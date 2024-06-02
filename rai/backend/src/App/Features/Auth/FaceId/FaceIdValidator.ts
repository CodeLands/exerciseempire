import {injectable} from 'inversify';
import z from 'zod';
import { ValidationResult } from '/App/Types/ValidatorTypes';

export type FaceIdData = {
  video: string;
};

export type FaceIdValidateResult = {
  wasRecognized: boolean;
};

export type FaceIdSetupResult = {
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

  public FaceResultValidate = (wasRecognized: boolean): ValidationResult<FaceIdValidateResult> => {
    const schema = z.object({
      wasRecognized: z.boolean({
          required_error: "Face recognition result is required"
      })
    });

    const validationResult = schema.safeParse({wasRecognized});

    if (!validationResult.success) {
        return { success: false, errors: validationResult.error.errors };
    } else {
        return { success: true, data: validationResult.data };
    }
  }

  public FaceResultSetup = (wasSetup: boolean): ValidationResult<FaceIdSetupResult> => {
    const schema = z.object({
      wasSetup: z.boolean({
          required_error: "Face recognition setup result is required"
      })
    });

    const validationResult = schema.safeParse({wasSetup});

    if (!validationResult.success) {
        return { success: false, errors: validationResult.error.errors };
    } else {
        return { success: true, data: validationResult.data };
    }
  }
}