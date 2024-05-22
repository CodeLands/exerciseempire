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

      const activitiesList = result.data;
      const validationResults = activitiesList.map((activity: any) =>
        ActivitiesSchema.safeParse(activity)
      );

      const invalidResults = validationResults.filter(
        (validationResult) => !validationResult.success
      );

      if (invalidResults.length > 0)
        return {
          status: RepositoryResultStatus.zodError,
          errors: [
            "Invalid data from database!",
            ...invalidResults.flatMap((result) =>
              result.error ? result.error.errors.map((e) => e.message) : []
            ),
          ],
        };

      const validData = validationResults
        .filter((validationResult) => validationResult.success)
        .map((validationResult) => validationResult.data) as z.infer<typeof ActivitiesSchema>[];

      return {
        status: RepositoryResultStatus.success,
        data: validData,
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
