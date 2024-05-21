import { z } from 'zod';

export const SensorDataSchema = z.object({
    id: z.number().int().positive().optional().describe('Primary key').refine((val) => val !== undefined, {
        message: 'ID must be a positive integer',
    }),
    value: z.string({
        message: 'Value must be a string'
    }).min(1, {
        message: 'Value must be at least 1 character long'
    }).max(255, {
        message: 'Value must be at most 255 characters long'
    }).nonempty({
        message: 'Value cannot be empty'
    }),
    timestamp: z.string({
        message: 'Timestamp must be a string'
    }).min(1, {
        message: 'Timestamp must be at least 1 character long'
    }).max(255, {
        message: 'Timestamp must be at most 255 characters long'
    }).nonempty({
        message: 'Timestamp cannot be empty'
    }).refine((val) => !isNaN(Date.parse(val)), {
        message: 'Timestamp must be a valid date'
    }),
    sensor_id: z.number().int().positive({
        message: 'Sensor ID must be a positive integer'
    }).refine((val) => val !== undefined, {
        message: 'Sensor ID must reference an existing sensor'
    }),
    executed_activity_id: z.number().int().positive({
        message: 'Executed Activity ID must be a positive integer'
    }).refine((val) => val !== undefined, {
        message: 'Executed Activity ID must reference an existing executed activity'
    })
});