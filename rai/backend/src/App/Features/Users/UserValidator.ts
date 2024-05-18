import { injectable} from "inversify";
import z from "zod";

@injectable()
export class UserValidator {

    public userIdValidate = async (userId: string) => {
        const schema = z.object({
            userId: z.number({ message: "Invalid user ID" })
        });

        const validationResult = schema.safeParse({userId});

        if (!validationResult.success) {
            return { success: false, errors: validationResult.error.errors };
        } else {
            return { success: true, data: validationResult.data };
        }
    }
}