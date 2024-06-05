import { injectable } from 'inversify';
import { z } from 'zod';
import { ValidationResult } from '/App/Types/ValidatorTypes';

@injectable()
export class ActivitiesValidator {
  public aggregateUserStatsValidate = (user_id: number): ValidationResult<{ user_id: number }> => {
    const schema = z.object({
      user_id: z.number({
        required_error: "User ID is required"
      }).int({
        message: "User ID must be an integer"
      }).positive({
        message: "User ID must be a positive number"
      }),
    });

    const validationResult = schema.safeParse({ user_id });

    if (!validationResult.success) {
      return { success: false, errors: validationResult.error.errors };
    } else {
      return { success: true, data: validationResult.data };
    }
  }

  public getActivityStatsValidate = (user_id: number, activity_id: number): ValidationResult<{ user_id: number, activity_id: number }> => {
    const schema = z.object({
      user_id: z.number({
        required_error: "User ID is required"
      }).int({
        message: "User ID must be an integer"
      }).positive({
        message: "User ID must be a positive number"
      }),
      activity_id: z.number({
        required_error: "Activity ID is required"
      }).int({
        message: "Activity ID must be an integer"
      }).positive({
        message: "Activity ID must be a positive number"
      }),
    });

    const validationResult = schema.safeParse({ user_id, activity_id });

    if (!validationResult.success) {
      return { success: false, errors: validationResult.error.errors };
    } else {
      return { success: true, data: validationResult.data };
    }
  }

  public validateUserId(userId: number) {
    const schema = z.object({
      user_id: z.number().positive({ message: "User ID must be a positive integer" })
    });

    return schema.safeParse({ user_id: userId });
  }
}
