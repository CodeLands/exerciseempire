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

  public async create( activity_id: number, user_id: number ): Promise<RepositoryResult<z.infer<typeof ExecutedActivitiySchema>>> {
    const result = await this.dbGateway.query(`
        INSERT INTO ExecutedActivities (activity_id, user_id, is_active, start_time, duration)
        VALUES (${activity_id}, ${user_id}, false, NOW(), 0)`)

    if (!result.dbSuccess)
        return {
            status: RepositoryResultStatus.dbError,
            errors: ["Database error!"],
        };

    if (result.data.length === 0)
        return {
            status: RepositoryResultStatus.failed,
            messages: ["ExecutedActivity not created!"],
        };

    const executedActivityData = result.data[0];
    const validationResult = ExecutedActivitiySchema.safeParse(executedActivityData);

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
    }
  }

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

    const executedActivityData = result.data[0];
    const validationResult = ExecutedActivitiySchema.safeParse(executedActivityData);

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
    }
  }


  public async getByActivityId( activity_id: number ): Promise<RepositoryResult<z.infer<typeof ExecutedActivitiySchema>[]>> {
    const result = await this.dbGateway.query(
        "SELECT * FROM ExecutedActivities WHERE activity_id = $1",
        [activity_id],
      );
    if (!result.dbSuccess)
        return {
            status: RepositoryResultStatus.dbError,
            errors: ["Database error!"],
        };

    if (result.data.length === 0)
        return {
            status: RepositoryResultStatus.failed,
            messages: ["Not executed activities found of this activity type!"],
        };

    const validationResult = z.array(ExecutedActivitiySchema).safeParse(result.data);

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
    }
  }

  public async toggleIsActive( executed_activity_id: number, is_active: boolean ): Promise<RepositoryResult<z.infer<typeof ExecutedActivitiySchema>>> {
    const result = await this.dbGateway.query(
        "UPDATE ExecutedActivities SET is_active = $1 WHERE id = $2 RETURNING *",
        [is_active, executed_activity_id],
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

    const executedActivityData = result.data[0];
    const validationResult = ExecutedActivitiySchema.safeParse(executedActivityData);

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
    }
  }
}
