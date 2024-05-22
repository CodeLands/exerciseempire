import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '/Shared/Types';
import { SensorDataController } from './SensorDataController';

@injectable()
export class SensorDataRouter {
    @inject(TYPES.SensorDataController)
    private readonly sensorDataController!: SensorDataController;

    public defineSensorDataRoutes(router: Router) {
        router.post('/sensor-data', this.sensorDataController.postSensorData);
    }
}