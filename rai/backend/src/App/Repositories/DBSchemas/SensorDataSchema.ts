import { z } from 'zod';

export const SensorDataSchema = z.object({
    id: z.number({
        required_error: 'Primary key is required'
    }).int().positive({
        message: 'Primary key must be a positive integer'
    }).describe('Primary key'),
    value: z.string({
        required_error: 'Value is required'
    }).min(1, {
        message: 'Value must be at least 1 character long'
    }).max(255, {
        message: 'Value must be at most 255 characters long'
    }).nonempty({
        message: 'Value cannot be empty'
    }),
    timestamp: z.number({
        message: 'Start time must be a number'
    }).int().positive({
        message: 'Start time must be a positive integer'
    }).refine((val) => val !== undefined, {
        message: 'Start time cannot be null'
    }),
    // timestamp: z.date().or(z.string().refine(val => !isNaN(Date.parse(val)), {
    //     message: 'Timestamp must be a valid ISO 8601 date string'
    // })),
    sensor_id: z.number().int().positive({
        message: 'Sensor ID must be a positive integer'
    }),
    executed_activity_id: z.number().int().positive({
        message: 'Executed Activity ID must be a positive integer'
    })
});
