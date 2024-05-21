import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "/Shared/Types";
import { RepositoryResultStatus } from "/App/Repositories/Types/RepositoryTypes";
import { SensorDataValidator } from "./SensorDataValidator";
import { SensorDataRepository } from "/App/Repositories/SensorDataRepository";

type SensorPayload = {
    executed_activity_id: number;
    sensor_id: number;
    value: string;
    timestamp: string;
    };

@injectable()
export class SensorDataController {
  @inject(TYPES.SensorDataValidator)
  private readonly sensorDataValidator!: SensorDataValidator;

  @inject(TYPES.SensorDataRepository)
  private readonly sensorDataRepository!: SensorDataRepository;

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



    // Save Sensor Data: If the activity is valid and in progress, save the sensor data.
      


    // Respond: Return an appropriate response based on the outcome of the above steps.
      

    const repoResultCheckIfUserExists = await this.sensorDataRepository.findByEmail(
      validatedPayload.data.email,
    );

    if (repoResultCheckIfUserExists.status === RepositoryResultStatus.dbError)
      return res.json({
        success: false,
        errors: ["Database Error!"],
      });

    if (repoResultCheckIfUserExists.status === RepositoryResultStatus.zodError)
      return res.json({
        success: false,
        errors: repoResultCheckIfUserExists.errors,
      });

    if (repoResultCheckIfUserExists.status === RepositoryResultStatus.failed)
      return res.json({
        success: false,
        errors: ["DB: User not found!"],
      });

    res.json({
      success: true,
      message: "User Logged in Successfully!",
      data: {
        token,
      },
    });
  };
}
