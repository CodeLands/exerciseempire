import { inject, injectable } from "inversify";
import { DbGateway } from "../Services/DbGateway";
import {
  RepositoryResultStatus,
  RepositoryResult,
} from "./Types/RepositoryTypes";
import { z } from "zod";
import { TYPES } from "/Shared/Types";
import { SensorDataSchema } from "./DBSchemas/SensorDataSchema";

@injectable()
export class SensorDataRepository {
  @inject(TYPES.DbGateway)
  private readonly dbGateway: DbGateway = null!;

  public async create(
    executed_activity_id: number,
    sensor_id: number,
    value: string,
    timestamp: string,
  ): Promise<RepositoryResult<z.infer<typeof SensorDataSchema>>> {
        const result = await this.dbGateway.query(
        "INSERT INTO SensorData (executed_activity_id, sensor_id, value, timestamp) VALUES ($1, $2, $3, $4) RETURNING *",
        [executed_activity_id, sensor_id, value, timestamp],
        );

        if (!result.dbSuccess)
            return {
                status: RepositoryResultStatus.dbError,
                errors: ["Database error!"],
            };

        if (result.data.length === 0)
            return {
                status: RepositoryResultStatus.failed,
                messages: ["SensorData not created!"],
            };

        const newSensorData = result.data[0];
        const validationResult = SensorDataSchema.safeParse(newSensorData);

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
