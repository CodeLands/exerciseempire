import { z } from 'zod';

export const ExecutedActivitiySchema = z.object({
    id: z.number().int().positive().optional().describe('Primary key').refine((val) => val !== undefined, {
        message: 'ID must be a positive integer',
    }),
    user_id: z.number().int().positive({
        message: 'User ID must be a positive integer'
    }).refine((val) => val !== undefined, {
        message: 'User ID must reference an existing user'
    }),
    activity_id: z.number().int().positive({
        message: 'Activity ID must be a positive integer'
    }).refine((val) => val !== undefined, {
        message: 'Activity ID must reference an existing activity'
    }),
    start_time: z.number({
        message: 'Start time must be a number'
    }).int().positive({
        message: 'Start time must be a positive integer'
    }).refine((val) => val !== undefined, {
        message: 'Start time cannot be null'
    }),
    // start_time: z.string({}).min(1, {
    //     message: 'Start time must be at least 1 character long'
    // }).max(255, {
    //     message: 'Start time must be at most 255 characters long'
    // }).nonempty({
    //     message: 'Start time cannot be empty'
    // }).refine((val) => !isNaN(Date.parse(val)), {
    //     message: 'Start time must be a valid date'
    // }),
    duration: z.number().int().nonnegative({
        message: 'Duration must be a non-negative integer'
    }).default(0),
    is_active: z.boolean({
        message: 'Is active must be a boolean'
    }).refine((val) => val !== undefined, {
        message: 'Is active cannot be null'
    })
});