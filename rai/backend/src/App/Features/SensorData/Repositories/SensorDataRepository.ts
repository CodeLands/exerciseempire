import { inject, injectable } from "inversify";
import { DbGateway } from "../../../Services/DbGateway";
import {
  RepositoryResultStatus,
  RepositoryResult,
} from "../../../Types/RepositoryTypes";
import { z } from "zod";
import { TYPES } from "/Shared/Types";
import { SensorDataSchema } from "./DBSchemas/SensorDataSchema";

const ActivityWithStatsSchema = z.object({
  id: z.number().int().positive(),
  stat: z.string().nonempty({ message: "Stat cannot be empty" }),
  base_stat_value: z.number(),
});

const RealTimeStatsSchema = z.object({
  id: z.number().int().positive(),
  executed_activity_id: z.number().int().positive(),
  stat_id: z.number().int().positive(),
  current_value: z.number().int().positive(),
  last_updated: z.union([z.string(), z.date()]).refine(value => !isNaN(Date.parse(value as string)), { message: "Invalid last updated format" }),
});

const LocationDataSchema = z.object({
  id: z.number().int().positive(),
  timestamp: z.union([z.string(), z.date()]).refine(value => !isNaN(Date.parse(value as string)), { message: "Invalid timestamp format" }),
  altitude: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  speed: z.number().optional(),
  executed_activity_id: z.number().int().positive(),
});

@injectable()
export class SensorDataRepository {
  @inject(TYPES.DbGateway)
  private readonly dbGateway: DbGateway = null!;

  public async create(
    executed_activity_id: number,
    sensor_id: number,
    value: number,
    timestamp: number,
  ): Promise<RepositoryResult<z.infer<typeof SensorDataSchema>>> {
    console.log(`Inserting sensor data: ${value}, ${timestamp}, ${sensor_id}, ${executed_activity_id}`);
    const result = await this.dbGateway.query(
      `INSERT INTO ExecutedActivitySensorData (value, timestamp, sensor_id, executed_activity_id) VALUES (${value}, NOW(), ${sensor_id}, ${executed_activity_id}) RETURNING *`,
    );

    if (!result.dbSuccess) {
      console.error("Database error during sensor data insertion:", result);
      return {
        status: RepositoryResultStatus.dbError,
        errors: ["Database error!"],
      };
    }

    if (result.data.length === 0) {
      return {
        status: RepositoryResultStatus.failed,
        messages: ["SensorData not created!"],
      };
    }

    const newSensorData = result.data[0];
    const validationResult = SensorDataSchema.safeParse(newSensorData);

    if (!validationResult.success) {
      console.error("Invalid data from database:", validationResult.error);
      return {
        status: RepositoryResultStatus.zodError,
        errors: [
          "Invalid data from database!",
          ...validationResult.error.errors.map((e) => e.message),
        ],
      };
    }

    console.log("Sensor data inserted successfully:", validationResult.data);
    return {
      status: RepositoryResultStatus.success,
      data: validationResult.data,
    };
  }

  public async getExecutedActivityBaseStats(executed_activity_id: number): Promise<RepositoryResult<z.infer<typeof ActivityWithStatsSchema>[]>> {
    console.log(`Fetching base stats for executed activity ID: ${executed_activity_id}`);
    const result = await this.dbGateway.query(
      `SELECT Stats.id, Stats.stat, ActivityBaseStats.base_stat_value
      FROM ExecutedActivities
      INNER JOIN Activities ON ExecutedActivities.activity_id = Activities.id
      INNER JOIN ActivityBaseStats ON Activities.id = ActivityBaseStats.activity_id
      INNER JOIN Stats ON ActivityBaseStats.stat_id = Stats.id
      WHERE ExecutedActivities.id = ${executed_activity_id}`
    );

    if (!result.dbSuccess) {
      console.error("Database error during fetching base stats:", result);
      return {
        status: RepositoryResultStatus.dbError,
        errors: ["Database error!"],
      };
    }

    if (result.data.length === 0) {
      return {
        status: RepositoryResultStatus.failed,
        messages: ["ActivityBaseStats not found!"],
      };
    }

    const newActivityStats = result.data;
    const validationResult = z.array(ActivityWithStatsSchema).safeParse(newActivityStats);

    if (!validationResult.success) {
      console.error("Invalid data from database:", validationResult.error);
      return {
        status: RepositoryResultStatus.zodError,
        errors: [
          "Invalid data from database!",
          ...validationResult.error.errors.map((e) => e.message),
        ],
      };
    }

    console.log("Base stats fetched successfully:", validationResult.data);
    return {
      status: RepositoryResultStatus.success,
      data: validationResult.data,
    };
  }

  public async incrementRealTimeStats(executed_activity_id: number, stat_id: number, increment_value: number): Promise<RepositoryResult<z.infer<typeof RealTimeStatsSchema>>> {
    console.log(`Incrementing real time stats for executed activity ID: ${executed_activity_id}, stat ID: ${stat_id} by ${increment_value}`);
    // select RealTimeStats to get current_value
    const currentStats = await this.dbGateway.query(
      `SELECT * FROM RealTimeStats WHERE executed_activity_id = ${executed_activity_id} AND stat_id = ${stat_id}`
    );

    if (!currentStats.dbSuccess) {
      console.error("Database error during fetching real time stats:", currentStats);
      return {
        status: RepositoryResultStatus.dbError,
        errors: ["Database error!"],
      };
    }

    if (currentStats.data.length === 0) {
      return {
        status: RepositoryResultStatus.failed,
        messages: ["ActivityStats not found!"],
      };
    }

    const currentStat = currentStats.data[0];
    const currentStatValue = currentStat.current_value;

    // update RealTimeStats with new value
    const result = await this.dbGateway.query(
      `UPDATE RealTimeStats SET current_value = ${currentStatValue + increment_value}, last_updated = NOW() WHERE executed_activity_id = ${executed_activity_id} AND stat_id = ${stat_id} RETURNING *`
    );

    if (!result.dbSuccess) {
      console.error("Database error during updating real time stats:", result);
      return {
        status: RepositoryResultStatus.dbError,
        errors: ["Database error!"],
      };
    }

    if (result.data.length === 0) {
      return {
        status: RepositoryResultStatus.failed,
        messages: ["ActivityStats not created!"],
      };
    }

    const newActivityStats = result.data[0];
    const validationResult = RealTimeStatsSchema.safeParse(newActivityStats);

    if (!validationResult.success) {
      console.error("Invalid data from database:", validationResult.error);
      return {
        status: RepositoryResultStatus.zodError,
        errors: [
          "Invalid data from database!",
          ...validationResult.error.errors.map((e) => e.message),
        ],
      };
    }

    console.log("Real time stats incremented successfully:", validationResult.data);
    return {
      status: RepositoryResultStatus.success,
      data: validationResult.data,
    };
  }

  public async createLocationData(
    executed_activity_id: number,
    timestamp: string,
    altitude: number | null,
    latitude: number | null,
    longitude: number | null,
    speed: number | null
  ): Promise<RepositoryResult<z.infer<typeof LocationDataSchema>>> {
    console.log(`Inserting location data: ${timestamp}, ${altitude}, ${latitude}, ${longitude}, ${speed}, ${executed_activity_id}`);
    const result = await this.dbGateway.query(
      `INSERT INTO ExecutedActivityLocationData (timestamp, altitude, latitude, longitude, speed, executed_activity_id) VALUES (NOW(), ${altitude}, ${latitude}, ${longitude}, ${speed}, ${executed_activity_id}) RETURNING *`
    );

    if (!result.dbSuccess) {
      console.error("Database error during location data insertion:", result);
      return {
        status: RepositoryResultStatus.dbError,
        errors: ["Database error!"],
      };
    }

    if (result.data.length === 0) {
      return {
        status: RepositoryResultStatus.failed,
        messages: ["LocationData not created!"],
      };
    }

    const newLocationData = result.data[0];
    const validationResult = LocationDataSchema.safeParse(newLocationData);

    if (!validationResult.success) {
      console.error("Invalid data from database:", validationResult.error);
      return {
        status: RepositoryResultStatus.zodError,
        errors: [
          "Invalid data from database!",
          ...validationResult.error.errors.map((e) => e.message),
        ],
      };
    }

    console.log("Location data inserted successfully:", validationResult.data);
    return {
      status: RepositoryResultStatus.success,
      data: validationResult.data,
    };
  }
}