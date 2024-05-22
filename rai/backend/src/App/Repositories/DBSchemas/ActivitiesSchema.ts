import { z } from "zod";

// Define the schema for the Activities table with custom error messages
export const ActivitiesSchema = z.object({
  id: z
    .number()
    .int({ message: "ID must be an integer" })
    .positive({ message: "ID must be a positive number" })
    .optional(),
  activity: z
    .string()
    .max(255, { message: "Activity must be 255 characters or less" })
    .nonempty({ message: "Activity cannot be empty" }),
  category_id: z
    .number()
    .int({ message: "Category ID must be an integer" })
    .positive({ message: "Category ID must be a positive number" }),
});
