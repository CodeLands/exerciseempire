import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "/Shared/Types";
import { RepositoryResultStatus } from "/App/Repositories/Types/RepositoryTypes";
import { SensorDataValidator } from "./SensorDataValidator";
import { SensorDataRepository } from "/App/Repositories/SensorDataRepository";
import { ExecutedActivityRepository } from "/App/Repositories/ExecutedActivityRepository";

type SensorPayload = {
    executed_activity_id: number;
    sensor_id: number;
    value: number;
    timestamp: number;
    };

@injectable()
export class SensorDataController {
  @inject(TYPES.SensorDataValidator)
  private readonly sensorDataValidator!: SensorDataValidator;

  @inject(TYPES.SensorDataRepository)
  private readonly sensorDataRepository!: SensorDataRepository;

  @inject(TYPES.ExecutedActivityRepository)
  private readonly executedActivityRepository!: ExecutedActivityRepository;

  public postSensorData = async (req: Request, res: Response) => {
    // Receive Sensor Data: Data is received via a POST request.
    let payload: SensorPayload | null = {
        executed_activity_id: req.body.executed_activity_id,
        sensor_id: req.body.sensor_id,
        value: req.body.value,
        timestamp: req.body.timestamp,
    };

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
  };
}
