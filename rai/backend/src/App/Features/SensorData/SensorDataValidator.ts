import { injectable } from 'inversify';
import z from 'zod';
import { ValidationResult } from '/App/Types/ValidatorTypes';

export type SensorDataPayload = {
    executed_activity_id: number;
    sensor_id: number;
    value: number;
    timestamp: number;
};

export type LocationDataPayload = {
    executed_activity_id: number;
    timestamp: string;
    altitude: number | null;
    latitude: number | null;
    longitude: number | null;
    speed: number | null;
};

export type CreateActivityPayload = {
    activity_id: number;
    user_id: number;
};

export type ToggleActivityPayload = {
    executed_activity_id: number;
};

@injectable()
export class SensorDataValidator {
    public createActivityValidate = (activity_id: number, user_id: number): ValidationResult<CreateActivityPayload> => {
        const schema = z.object({
            activity_id: z.number({
                required_error: "activity_id is required"
            }).nonnegative({
                message: "activity_id is required and must be nonnegative"
            }),
            user_id: z.number({
                required_error: "user_id is required"
            }).nonnegative({
                message: "user_id is required and must be nonnegative"
            })
        });
    
        const validationResult = schema.safeParse({ activity_id, user_id });
    
        if (!validationResult.success) {
            return { success: false, errors: validationResult.error.errors };
        } else {
            return { success: true, data: validationResult.data };
        }
    }

    public toggleActivityValidate = (executed_activity_id: number): ValidationResult<ToggleActivityPayload> => {
        const schema = z.object({
            executed_activity_id: z.number({
                required_error: "executed_activity_id is required"
            }).nonnegative({
                message: "executed_activity_id is required and must be nonnegative"
            })
        });
    
        const validationResult = schema.safeParse({ executed_activity_id });
    
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

    public locationDataValidate = (
        executed_activity_id: number,
        timestamp: string,
        altitude: number | null,
        latitude: number | null,
        longitude: number | null,
        speed: number | null
    ): ValidationResult<LocationDataPayload> => {
        const schema = z.object({
            executed_activity_id: z.number({
                required_error: "executed_activity_id is required"
            }).nonnegative({
                message: "executed_activity_id is required and must be nonnegative"
            }),
            timestamp: z.string({
                required_error: "timestamp is required"
            }).refine(value => !isNaN(Date.parse(value)), { message: "Invalid timestamp format" }),
            altitude: z.number().nullable(),
            latitude: z.number().nullable(),
            longitude: z.number().nullable(),
            speed: z.number().nullable()
        });

        const validationResult = schema.safeParse({ executed_activity_id, timestamp, altitude, latitude, longitude, speed });

        if (!validationResult.success) {
            return { success: false, errors: validationResult.error.errors };
        } else {
            return { success: true, data: validationResult.data };
        }
    }
}