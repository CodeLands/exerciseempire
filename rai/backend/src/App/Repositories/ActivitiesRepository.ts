import { inject, injectable } from "inversify";
import { DbGateway } from "../Services/DbGateway";
import { UserAuthSchema } from "./DBSchemas/UserSchema";
import {
  RepositoryResultStatus,
  RepositoryResult,
} from "./Types/RepositoryTypes";
import { z } from "zod";
import { TYPES } from "/Shared/Types";
import { ActivitiesSchema } from "./DBSchemas/ActivitiesSchema";

@injectable()
export class ActivitiesRepository {
  @inject(TYPES.DbGateway)
  private readonly dbGateway: DbGateway = null!;

  public async listActivities(): Promise<RepositoryResult<z.infer<typeof ActivitiesSchema>[]>> {
      const result = await this.dbGateway.query("SELECT * FROM Activities");
      if (!result.dbSuccess)
        return {
          status: RepositoryResultStatus.dbError,
          errors: ["Database error!"],
        };
      if (result.data.length === 0)
        return {
          status: RepositoryResultStatus.failed,
          messages: ["No activities"],
        };

      const validationResult = z.array(ActivitiesSchema).safeParse(result.data);

      if (!validationResult.success)
            return {
              status: RepositoryResultStatus.zodError,
              errors: [
                "Invalid data from database!",
                ...validationResult.error.errors.map((e) => e.message),
              ],
            };

      return {
        status: RepositoryResultStatus.success,
        data: validationResult.data,
      };
    }
  /*public async create(data: {
    email: string;
    pass_hash: string;
  }): Promise<RepositoryResult<z.infer<typeof UserAuthSchema>>> {
    const result = await this.dbGateway.query(
      "INSERT INTO UsersAuth (email, pass_hash, hasset2fa) VALUES ($1, $2, false) RETURNING *",
      [data.email, data.pass_hash],
    );

    if (!result.dbSuccess)
      return {
        status: RepositoryResultStatus.dbError,
        errors: ["Database error!"],
      };

    if (result.data.length === 0)
      return {
        status: RepositoryResultStatus.failed,
        messages: ["User not created!"],
      };

    const newUser = result.data[0];
    const validationResult = UserAuthSchema.safeParse(newUser);

    if (!validationResult.success)
      return {
        status: RepositoryResultStatus.zodError,
        errors: [
          "Invalid data from database!",
          ...validationResult.error.errors.map((e) => e.message),
        ],
      };

    return {
      status: RepositoryResultStatus.success,
      data: validationResult.data,
    };
  }*/
}
