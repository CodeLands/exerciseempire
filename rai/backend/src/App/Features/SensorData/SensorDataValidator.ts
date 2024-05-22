import { injectable } from 'inversify';
import z from 'zod';
import { ValidationResult } from '/App/Types/ValidatorTypes';

export type SensorData = {
    executed_activity_id: number;
    sensor_id: number;
    value: number;
    timestamp: number;
};

@injectable()
export class SensorDataValidator {
    public sensorDataValidate = (executed_activity_id: number, sensor_id: number, value: number, timestamp: number): ValidationResult<SensorData> => {
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