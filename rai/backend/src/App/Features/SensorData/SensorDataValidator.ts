import { injectable } from 'inversify';
import z from 'zod';
import { ValidationResult } from '/App/Types/ValidatorTypes';

export type CreateActivityPayload = {
    activity_id: number;
    user_id: number;
};

export type ToggleActivityPayload = {
    executed_activity_id: number;
}

export type SensorDataPayload = {
    executed_activity_id: number;
    sensor_id: number;
    value: number;
    timestamp: number;
};

@injectable()
export class SensorDataValidator {
    public createActivityValidate = (executed_activity_id: number, user_id: number): ValidationResult<CreateActivityPayload> => {
        const schema = z.object({
            activity_id: z.number({
                required_error: "executed_activity_id is required"
            }).nonnegative({
                message: "executed_activity_id is required and must be nonnegative"
            }),
            user_id: z.number({
                required_error: "user_id is required"
            }).nonnegative({
                message: "user_id is required and must be nonnegative"
            })
        });
    
        const validationResult = schema.safeParse({ executed_activity_id, user_id });
    
        if (!validationResult.success) {
            return { success: false, errors: validationResult.error.errors };
        } else {
            return { success: true, data: validationResult.data };
        }
    }

    public toggleActivityValidate = (activity_id: number): ValidationResult<ToggleActivityPayload> => {
        const schema = z.object({
            executed_activity_id: z.number({
                required_error: "activity_id is required"
            }).nonnegative({
                message: "activity_id is required and must be nonnegative"
            })
        });
    
        const validationResult = schema.safeParse({ activity_id });
    
        if (!validationResult.success) {
            return { success: false, errors: validationResult.error.errors };
        } else {
            return { success: true, data: validationResult.data };
        }
    }

    public sensorDataValidate = (executed_activity_id: number, sensor_id: number, value: number, timestamp: number): ValidationResult<SensorDataPayload> => {
        const schema = z.object({
            executed_activity_id: z.number({
                required_error: "executed_activity_id is required"
            }).nonnegative({
                message: "executed_activity_id is required and must be nonnegative"
            }),
            sensor_id: z.number({
                required_error: "sensor_id is required"
            }).nonnegative({
                message: "sensor_id is required and must be nonnegative"
            }),
            value: z.number({
                required_error: "value is required"
            }),
            timestamp: z.number({
                required_error: "timestamp is required"
            })
        });
    
        const validationResult = schema.safeParse({ executed_activity_id, sensor_id, value, timestamp });
    
        if (!validationResult.success) {
            return { success: false, errors: validationResult.error.errors };
        } else {
            return { success: true, data: validationResult.data };
        }
    }
}