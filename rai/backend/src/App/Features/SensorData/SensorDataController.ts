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
    // Receive Sensor Data: Data is received via a POST request.
    let payload: SensorDataPayload | null = null
    try {
      payload = {
        executed_activity_id: JSON.parse(req.body.executed_activity_id),
        sensor_id: JSON.parse(req.body.sensor_id), 
        value: JSON.parse(req.body.value),
        timestamp: JSON.parse(req.body.timestamp),
    };
    } catch (e) {
      console.log(e);
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
    if (!validatedPayload.success)
      return res.json({
        success: false,
        errors: validatedPayload.errors,
      });

    // Check Activity Validity: Verify that the executed_activity_id corresponds to a currently active activity in the database.
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

    if (!repoResultGetExecutedActivityById.data.is_active)
      return res.json({
        success: false,
        errors: ["DB: ExecutedActivity referenced by SensorData is not active!"],
      });

    // Save Sensor Data: If the activity is valid and in progress, save the sensor data.
    const repoResultCreateSensorData = await this.sensorDataRepository.create(
      validatedPayload.data.executed_activity_id,
      validatedPayload.data.sensor_id,
      validatedPayload.data.value,
      validatedPayload.data.timestamp,
    );

    if (repoResultCreateSensorData.status === RepositoryResultStatus.dbError)
      return res.json({
        success: false,
        errors: ["Database Error!"],
      });

    if (repoResultCreateSensorData.status === RepositoryResultStatus.zodError)
      return res.json({
        success: false,
        errors: repoResultCreateSensorData.errors,
      });

    if (repoResultCreateSensorData.status === RepositoryResultStatus.failed)
      return res.json({
        success: false,
        errors: ["DB: SensorData could not be created!"],
      });

    // Respond: Return an appropriate response based on the outcome of the above steps.
    res.json({
      success: true,
      message: "Sensor Data Saved Successfully!",
      data: repoResultCreateSensorData.data,
    });
  }
}
