import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '/Shared/Types';
import { SensorDataController } from './SensorDataController';

@injectable()
export class SensorDataRouter {
    @inject(TYPES.SensorDataController)
    private readonly sensorDataController!: SensorDataController;

    public defineSensorDataRoutes(router: Router) {
        router.post('/create-executed-activity', this.sensorDataController.createExecutedActivity);
        router.post('/toggle-activity', this.sensorDataController.toggleActivity);
        router.post('/sensor-data', this.sensorDataController.postSensorData);
        router.post('/location-data', this.sensorDataController.postLocationData);
    }
}