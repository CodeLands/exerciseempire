import { inject, injectable } from "inversify";
import { DbGateway } from "../../../Services/DbGateway";
import {
  RepositoryResultStatus,
  RepositoryResult,
} from "../../../Types/RepositoryTypes";
import { z } from "zod";
import { TYPES } from "/Shared/Types";
import { ExecutedActivitiySchema } from "./DBSchemas/ExecutedActivitySchema";

@injectable()
export class ExecutedActivityRepository {
  @inject(TYPES.DbGateway)
  private readonly dbGateway: DbGateway = null!;

  public async getById( executed_activity_id: number ): Promise<RepositoryResult<z.infer<typeof ExecutedActivitiySchema>>> {
    const result = await this.dbGateway.query(
        "SELECT * FROM ExecutedActivities WHERE id = $1",
        [executed_activity_id],
      );
    if (!result.dbSuccess)
        return {
            status: RepositoryResultStatus.dbError,
            errors: ["Database error!"],
        };


    if (result.data.length === 0)
        return {
            status: RepositoryResultStatus.failed,
            messages: ["ExecutedActivity not found!"],
        };


    const newSensorData = result.data[0];
    const validationResult = ExecutedActivitiySchema.safeParse(newSensorData);

    if (!validationResult.success)
        return {
          status: RepositoryResultStatus.zodError,
          errors: [
            "Invalid data from database!",
            validationResult.error.flatten().fieldErrors.toString(),
          ],
        };

    return {
        status: RepositoryResultStatus.success,
        data: validationResult.data,
    }
  }
}
