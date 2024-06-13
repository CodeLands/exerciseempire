import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "/Shared/Types";
import { SensorDataValidator } from "./SensorDataValidator";
import { SensorDataRepository } from "./Repositories/SensorDataRepository";
import { ExecutedActivityRepository } from "./Repositories/ExecutedActivityRepository";
import { RepositoryResultStatus } from "/App/Types/RepositoryTypes";

export type SensorDataPayload = {
  executed_activity_id: number;
  sensor_id: number;
  value: number;
  timestamp: number;
};

export type LocationDataPayload = {
  executed_activity_id: number;
  timestamp: string;
  altitude: number | null;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
};

export type CreateActivityPayload = {
  activity_id: number;
  user_id: number;
};

export type ToggleActivityPayload = {
  executed_activity_id: number;
};

@injectable()
export class SensorDataController {
  @inject(TYPES.SensorDataValidator)
  private readonly sensorDataValidator!: SensorDataValidator;

  @inject(TYPES.SensorDataRepository)
  private readonly sensorDataRepository!: SensorDataRepository;

  @inject(TYPES.ExecutedActivityRepository)
  private readonly executedActivityRepository!: ExecutedActivityRepository;

  public createExecutedActivity = async (req: Request, res: Response) => {
    // Receive Sensor Data: Data is received via a POST request.
    let payload: CreateActivityPayload | null = null
    try {
      payload = {
        activity_id: JSON.parse(req.body.activity_id),
        user_id: JSON.parse(req.body.user_id),
      };
    }
    catch (e) {
      console.log(e);
      return res.json({
        success: false,
        errors: ["Invalid JSON!"],
      });
    }

    // Validate Data Structure: Ensure the incoming sensor data matches the expected schema.
    const validatedPayload = this.sensorDataValidator.createActivityValidate(payload.activity_id, payload.user_id);
    payload = null;
    if (!validatedPayload.success)
      return res.json({
        success: false,
        errors: validatedPayload.errors,
      });

    const repoResultCreateExecutedActivity = await this.executedActivityRepository.create(
      validatedPayload.data.activity_id,
      validatedPayload.data.user_id,
    );

    if (repoResultCreateExecutedActivity.status === RepositoryResultStatus.dbError)
      return res.json({
        success: false,
        errors: ["Database Error!"],
      });

    if (repoResultCreateExecutedActivity.status === RepositoryResultStatus.zodError)
      return res.json({
        success: false,
        errors: repoResultCreateExecutedActivity.errors,
      });

    if (repoResultCreateExecutedActivity.status === RepositoryResultStatus.failed)
      return res.json({
        success: false,
        errors: ["DB: ExecutedActivity could not be created!"],
      });

    // Respond: Return an appropriate response based on the outcome of the above steps.
    res.json({
      success: true,
      message: "Executed Activity Created Successfully!",
      data: repoResultCreateExecutedActivity.data,
    });
  }

  public toggleActivity = async (req: Request, res: Response) => {
    // Receive Sensor Data: Data is received via a POST request.
    let payload: ToggleActivityPayload | null = null;
    try {
      payload = {
        executed_activity_id: JSON.parse(req.body.executed_activity_id)
      };
    }
    catch (e) {
      console.log(e);
      return res.json({
        success: false,
        errors: ["Invalid JSON!"],
      });
    }

    // Validate Data Structure: Ensure the incoming sensor data matches the expected schema.
    const validatedPayload = this.sensorDataValidator.toggleActivityValidate(payload.executed_activity_id);
    payload = null;
    if (!validatedPayload.success)
      return res.json({
        success: false,
        errors: validatedPayload.errors,
      });

    // Get Executed Activity by ID
    const repoResultGetExecutedActivityById = await this.executedActivityRepository.getById(validatedPayload.data.executed_activity_id);

    if (repoResultGetExecutedActivityById.status === RepositoryResultStatus.dbError)
      return res.json({
        success: false,
        errors: ["Database Error!"],
      });

    if (repoResultGetExecutedActivityById.status === RepositoryResultStatus.zodError)
      return res.json({
        success: false,
        errors: repoResultGetExecutedActivityById.errors,
      });

    if (repoResultGetExecutedActivityById.status === RepositoryResultStatus.failed)
      return res.json({
        success: false,
        errors: ["DB: ExecutedActivity referenced by SensorData not found!"],
      });

    // else activity exists, toggle its is_active status
    const repoResultToggleExecutedActivity = await this.executedActivityRepository.toggleIsActive(validatedPayload.data.executed_activity_id, !repoResultGetExecutedActivityById.data.is_active );

    if (repoResultToggleExecutedActivity.status === RepositoryResultStatus.dbError)
      return res.json({
        success: false,
        errors: ["Database Error!"],
      });

    if (repoResultToggleExecutedActivity.status === RepositoryResultStatus.zodError)
      return res.json({
        success: false,
        errors: repoResultToggleExecutedActivity.errors,
      });

    if (repoResultToggleExecutedActivity.status === RepositoryResultStatus.failed)
      return res.json({
        success: false,
        errors: ["DB: ExecutedActivity could not be toggled!"],
      });

    // If activity is toggled on, return toggled on message
    if (repoResultToggleExecutedActivity.data.is_active) {
      return res.json({
        success: true,
        message: "Executed Activity Toggled On Successfully!",
        data: repoResultToggleExecutedActivity.data,
      });
    }

    // If activity is toggled off, return toggled off message
    return res.json({
      success: true,
      message: "Executed Activity Toggled Off Successfully!",
      data: repoResultToggleExecutedActivity.data,
    });
  }

  public postSensorData = async (req: Request, res: Response) => {
    console.log("Received sensor data request:", req.body);

    // Receive Sensor Data: Data is received via a POST request.
    let payload: SensorDataPayload | null = null;
    try {
      payload = {
        executed_activity_id: Number(req.body.executed_activity_id),
        sensor_id: Number(req.body.sensor_id),
        value: Number(req.body.value),
        timestamp: Number(req.body.timestamp),
      };
      console.log("Parsed payload:", payload);
    } catch (e) {
      console.log("JSON parsing error:", e);
      return res.json({
        success: false,
        errors: ["Invalid JSON!"],
      });
    }

    // Validate Data Structure: Ensure the incoming sensor data matches the expected schema.
    const validatedPayload = this.sensorDataValidator.sensorDataValidate(
      payload.executed_activity_id,
      payload.sensor_id,
      payload.value,
      payload.timestamp,
    );
    payload = null;
    if (!validatedPayload.success) {
      console.log("Validation errors:", validatedPayload.errors);
      return res.json({
        success: false,
        errors: validatedPayload.errors,
      });
    }

    // Check Activity Validity: Verify that the executed_activity_id corresponds to a currently active activity in the database.
    const repoResultGetExecutedActivityById = await this.executedActivityRepository.getById(validatedPayload.data.executed_activity_id);
    console.log("Executed activity:", repoResultGetExecutedActivityById);

    if (repoResultGetExecutedActivityById.status === RepositoryResultStatus.dbError) {
      console.log("Database error while fetching executed activity.");
      return res.json({
        success: false,
        errors: ["Database Error!"],
      });
    }

    if (repoResultGetExecutedActivityById.status === RepositoryResultStatus.zodError) {
      console.log("Zod validation error while fetching executed activity.");
      return res.json({
        success: false,
        errors: repoResultGetExecutedActivityById.errors,
      });
    }

    if (repoResultGetExecutedActivityById.status === RepositoryResultStatus.failed) {
      console.log("Executed activity not found.");
      return res.json({
        success: false,
        errors: ["DB: ExecutedActivity referenced by SensorData not found!"],
      });
    }

    if (!repoResultGetExecutedActivityById.data.is_active) {
      // Set activity to active if it is not active
      console.log("Executed activity is not active. Activating now...");
      const toggleResult = await this.executedActivityRepository.toggleIsActive(validatedPayload.data.executed_activity_id, true);
      console.log("Toggle activity result:", toggleResult);

      if (toggleResult.status !== RepositoryResultStatus.success) {
        return res.json({
          success: false,
          errors: ["DB: Failed to activate ExecutedActivity!"],
        });
      }

      // Re-fetch the activity to ensure it is now active
      const recheckResult = await this.executedActivityRepository.getById(validatedPayload.data.executed_activity_id);
      if (recheckResult.status !== RepositoryResultStatus.success || !recheckResult.data.is_active) {
        return res.json({
          success: false,
          errors: ["DB: ExecutedActivity is still not active after activation attempt!"],
        });
      }
    }

    // Get Base Stats: Retrieve the base stats for the activity.
    const getExecutedActivityBaseStats = await this.sensorDataRepository.getExecutedActivityBaseStats(validatedPayload.data.executed_activity_id);
    console.log("Base stats:", getExecutedActivityBaseStats);

    if (getExecutedActivityBaseStats.status === RepositoryResultStatus.dbError) {
      console.log("Database error while fetching base stats.");
      return res.json({
        success: false,
        errors: ["Database Error!"],
      });
    }

    if (getExecutedActivityBaseStats.status === RepositoryResultStatus.zodError) {
      console.log("Zod validation error while fetching base stats.");
      return res.json({
        success: false,
        errors: getExecutedActivityBaseStats.errors,
      });
    }

    if (getExecutedActivityBaseStats.status === RepositoryResultStatus.failed) {
      console.log("Base stats not found.");
      return res.json({
        success: false,
        errors: ["DB: ExecutedActivityBaseStats not found!"],
      });
    }

    // Save Sensor Data: If the activity is valid and in progress, save the sensor data.
    const repoResultCreateSensorData = await this.sensorDataRepository.create(
      validatedPayload.data.executed_activity_id,
      validatedPayload.data.sensor_id,
      validatedPayload.data.value,
      validatedPayload.data.timestamp,
    );
    console.log("Sensor data save result:", repoResultCreateSensorData);

    if (repoResultCreateSensorData.status === RepositoryResultStatus.dbError) {
      console.log("Database error while saving sensor data.");
      return res.json({
        success: false,
        errors: ["Database Error!"],
      });
    }

    if (repoResultCreateSensorData.status === RepositoryResultStatus.zodError) {
      console.log("Zod validation error while saving sensor data.");
      return res.json({
        success: false,
        errors: repoResultCreateSensorData.errors,
      });
    }

    if (repoResultCreateSensorData.status === RepositoryResultStatus.failed) {
      console.log("Sensor data not created.");
      return res.json({
        success: false,
        errors: ["DB: SensorData could not be created!"],
      });
    }

    // Calculate Stats: Calculate the stats for the sensor data.
    const baseStats = getExecutedActivityBaseStats.data;
    const sensorData = validatedPayload.data.value;

    // Loop through baseStats and multiply base_stat_value by sensorData value
    const calculatedStats = baseStats.map((current_stat) => {
      return {
        id: current_stat.id,
        stat: current_stat.stat,
        value: current_stat.base_stat_value * sensorData,
      };
    });

    console.log("Calculated stats:", calculatedStats);

    const insertRealTimeStats = async () => {
      for (const current_stat of calculatedStats) {
        const repoResultIncrementRealTimeStats = await this.sensorDataRepository.incrementRealTimeStats(
          validatedPayload.data.executed_activity_id,
          current_stat.id,
          current_stat.value,
        );
        console.log("Increment real time stats result:", repoResultIncrementRealTimeStats);

        if (repoResultIncrementRealTimeStats.status === RepositoryResultStatus.dbError) {
          console.log("Database error while incrementing real time stats.");
          throw new Error("Database Error!");
        }

        if (repoResultIncrementRealTimeStats.status === RepositoryResultStatus.zodError) {
          console.log("Zod validation error while incrementing real time stats.");
          throw new Error("Zod validation error!");
        }

        if (repoResultIncrementRealTimeStats.status === RepositoryResultStatus.failed) {
          console.log("Real time stats not incremented.");
          throw new Error("RealTimeStats could not be incremented!");
        }
      }
    };

    try {
      await insertRealTimeStats();
    } catch (error) {
      return res.json({
        success: false,
        errors: [(error as Error).message],
      });
    }

    console.log("Sensor Data Saved and Computed Successfully!");

    // Respond: Return an appropriate response based on the outcome of the above steps.
    res.json({
      success: true,
      message: "Sensor Data Saved and Computed Successfully!",
      data: repoResultCreateSensorData.data,
    });
  }

  public postLocationData = async (req: Request, res: Response) => {
    console.log("Received location data request:", req.body);

    // Receive Location Data: Data is received via a POST request.
    let payload: LocationDataPayload | null = null;
    try {
      payload = {
        executed_activity_id: Number(req.body.executed_activity_id),
        timestamp: String(req.body.timestamp),
        altitude: req.body.altitude ? Number(req.body.altitude) : null,
        latitude: req.body.latitude ? Number(req.body.latitude) : null,
        longitude: req.body.longitude ? Number(req.body.longitude) : null,
        speed: req.body.speed ? Number(req.body.speed) : null,
      };
      console.log("Parsed payload:", payload);
    } catch (e) {
      console.log("JSON parsing error:", e);
      return res.json({
        success: false,
        errors: ["Invalid JSON!"],
      });
    }

    // Validate Data Structure: Ensure the incoming location data matches the expected schema.
    const validatedPayload = this.sensorDataValidator.locationDataValidate(
      payload.executed_activity_id,
      payload.timestamp,
      payload.altitude,
      payload.latitude,
      payload.longitude,
      payload.speed,
    );
    payload = null;
    if (!validatedPayload.success) {
      console.log("Validation errors:", validatedPayload.errors);
      return res.json({
        success: false,
        errors: validatedPayload.errors,
      });
    }

    // Check Activity Validity: Verify that the executed_activity_id corresponds to a currently active activity in the database.
    const repoResultGetExecutedActivityById = await this.executedActivityRepository.getById(validatedPayload.data.executed_activity_id);
    console.log("Executed activity:", repoResultGetExecutedActivityById);

    if (repoResultGetExecutedActivityById.status === RepositoryResultStatus.dbError) {
      console.log("Database error while fetching executed activity.");
      return res.json({
        success: false,
        errors: ["Database Error!"],
      });
    }

    if (repoResultGetExecutedActivityById.status === RepositoryResultStatus.zodError) {
      console.log("Zod validation error while fetching executed activity.");
      return res.json({
        success: false,
        errors: repoResultGetExecutedActivityById.errors,
      });
    }

    if (repoResultGetExecutedActivityById.status === RepositoryResultStatus.failed) {
      console.log("Executed activity not found.");
      return res.json({
        success: false,
        errors: ["DB: ExecutedActivity referenced by LocationData not found!"],
      });
    }

    if (!repoResultGetExecutedActivityById.data.is_active) {
      // Set activity to active if it is not active
      console.log("Executed activity is not active. Activating now...");
      const toggleResult = await this.executedActivityRepository.toggleIsActive(validatedPayload.data.executed_activity_id, true);
      console.log("Toggle activity result:", toggleResult);

      if (toggleResult.status !== RepositoryResultStatus.success) {
        return res.json({
          success: false,
          errors: ["DB: Failed to activate ExecutedActivity!"],
        });
      }

      // Re-fetch the activity to ensure it is now active
      const recheckResult = await this.executedActivityRepository.getById(validatedPayload.data.executed_activity_id);
      if (recheckResult.status !== RepositoryResultStatus.success || !recheckResult.data.is_active) {
        return res.json({
          success: false,
          errors: ["DB: ExecutedActivity is still not active after activation attempt!"],
        });
      }
    }

    // Save Location Data: If the activity is valid and in progress, save the location data.
    const repoResultCreateLocationData = await this.sensorDataRepository.createLocationData(
      validatedPayload.data.executed_activity_id,
      validatedPayload.data.timestamp,
      validatedPayload.data.altitude,
      validatedPayload.data.latitude,
      validatedPayload.data.longitude,
      validatedPayload.data.speed,
    );
    console.log("Location data save result:", repoResultCreateLocationData);

    if (repoResultCreateLocationData.status === RepositoryResultStatus.dbError) {
      console.log("Database error while saving location data.");
      return res.json({
        success: false,
        errors: ["Database Error!"],
      });
    }

    if (repoResultCreateLocationData.status === RepositoryResultStatus.zodError) {
      console.log("Zod validation error while saving location data.");
      return res.json({
        success: false,
        errors: repoResultCreateLocationData.errors,
      });
    }

    if (repoResultCreateLocationData.status === RepositoryResultStatus.failed) {
      console.log("Location data not created.");
      return res.json({
        success: false,
        errors: ["DB: LocationData could not be created!"],
      });
    }

    console.log("Location Data Saved Successfully!");

    // Respond: Return an appropriate response based on the outcome of the above steps.
    res.json({
      success: true,
      message: "Location Data Saved Successfully!",
      data: repoResultCreateLocationData.data,
    });
  }
}