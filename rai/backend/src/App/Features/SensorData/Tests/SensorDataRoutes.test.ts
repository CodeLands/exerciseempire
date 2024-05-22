import 'reflect-metadata';
import request from 'supertest';
import express from 'express';
import { createApp } from '/Shared/BaseApp';
import { testContainer } from '../../../../Tests/TestContainer';
import { DbGatewayMock } from '../../../../Tests/Mocks/DB/DbGatewayMock';
import { TYPES } from '/Shared/Types';
import { SensorDataValidator } from '../SensorDataValidator';
import { SensorDataRepository } from '../Repositories/SensorDataRepository';
import { ExecutedActivityRepository } from '../Repositories/ExecutedActivityRepository';

// Setup of Controller Dependencies
  // Mocks
let dbGateway: DbGatewayMock = null!;

  // Dependencies + Spies
let sensorDataValidator: SensorDataValidator = null!;
let sensorDataValidateSpy: jest.Spied<typeof sensorDataValidator.sensorDataValidate> = null!;

let sensorDataRepository: SensorDataRepository = null!;
let createSensorDataSpy: jest.Spied<typeof sensorDataRepository.create> = null!;

let executedActivityRepository: ExecutedActivityRepository = null!;
let getExecutedActivityByIdSpy: jest.Spied<typeof executedActivityRepository.getById> = null!;

// TO ADD - ActivityRepository

  // App
let testApp: express.Application;
 
beforeAll(() => {
  dbGateway = testContainer.get(TYPES.DbGateway);

  sensorDataValidator = testContainer.get(TYPES.SensorDataValidator);
  sensorDataValidateSpy = jest.spyOn(sensorDataValidator, 'sensorDataValidate');

  executedActivityRepository = testContainer.get(TYPES.ExecutedActivityRepository);
  getExecutedActivityByIdSpy = jest.spyOn(executedActivityRepository, 'getById');

  sensorDataRepository = testContainer.get(TYPES.SensorDataRepository);
  createSensorDataSpy = jest.spyOn(sensorDataRepository, 'create');



  testApp = createApp(testContainer);
}); 

describe('SensorData Routes:', () => { 
  // beforeEach(() => {
    
  // });

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('POST /sensor-data Route:', () => {
    describe('Successfull cases:', () => {
      it('should ALLOW Saving Sensor Data if ASSOCIATED ACTIVITY IS ACTIVE', async () => {
        // Setup mocks - TO CHECK
        const timestamp = 1

        const dbTimestamp = new Date(timestamp);

        const dbMockedCheckActivityIsActive = [{
          id: 1,
          user_id: 1,
          activity_id: 1,
          start_time: dbTimestamp,  // Assuming this format aligns with how you handle dates in JavaScript
          duration: 0,
          is_active: true,  // Correctly using boolean rather than "active"
        }];        
        const dbMockedCreateSensorData = [{
          id: 1,
          executed_activity_id: 1,
          sensor_id: 1,
          value: "1",
          timestamp: dbTimestamp,
        }]
        dbGateway.query = jest.fn().mockResolvedValueOnce({
          dbSuccess: true,
          data: dbMockedCheckActivityIsActive
        }).mockResolvedValueOnce({
          dbSuccess: true,
          data: dbMockedCreateSensorData
        });
        
        // Call BlackBox / System Under Test
        const payload = {
          executed_activity_id: 1,
          sensor_id: 1,
          value: 1,
          timestamp: timestamp
        }
        const response = await request(testApp).post('/sensor-data').send(payload);

        // Expectations
          // Validation
        expect(sensorDataValidateSpy).toHaveBeenCalledTimes(1);
        expect(sensorDataValidateSpy).toHaveBeenCalledWith(payload.executed_activity_id, payload.sensor_id, payload.value, payload.timestamp);
        expect(sensorDataValidateSpy).toHaveReturnedWith({
          data: {
            executed_activity_id: 1,
            sensor_id: 1,
            timestamp: timestamp,
            value: 1
          },
          success: true
        });

          // Repository check if associated activity is active
        expect(getExecutedActivityByIdSpy).toHaveBeenCalledTimes(1);
        expect(getExecutedActivityByIdSpy).toHaveBeenCalledWith(payload.executed_activity_id);
        // expect(getExecutedActivityByIdSpy).toHaveReturnedWith({
        //   status: 'success',
        //   data: dbMockedCheckActivityIsActive[0]
        // });

          // Check if repository called dbGateway.query 
        //expect(dbGateway.query).toHaveBeenCalledTimes(2);
        expect(dbGateway.query).toHaveBeenNthCalledWith(1, 'SELECT * FROM ExecutedActivities WHERE id = $1', [payload.executed_activity_id]);

          // Repository creates sensor data entry
        expect(createSensorDataSpy).toHaveBeenCalledTimes(1);
        expect(createSensorDataSpy).toHaveBeenCalledWith(payload.executed_activity_id, payload.sensor_id, payload.value, payload.timestamp);

          // Check if repository called dbGateway.query
        expect(dbGateway.query).toHaveBeenNthCalledWith(2, 'INSERT INTO ExecutedActivitySensorData (value, timestamp, sensor_id, executed_activity_id) VALUES (1, NOW(), 1, 1) RETURNING *');

          // Response
        expect(response.body).toEqual({
          success: true,
          message: "Sensor Data Saved Successfully!",
          data: { 
            id: 1,
            executed_activity_id: 1,
            sensor_id: 1,
            value: "1",
            timestamp: JSON.stringify(dbTimestamp).substring(1, JSON.stringify(dbTimestamp).length - 1) // Assuming this format aligns with how you handle dates in JavaScript,
          }
        });
      });
    })
    describe('Failed cases:', () => {
      describe('INVALID Payload:', () => {
        // it('should NOT ALLOW Sensor Data WITHOUT activity_id to save', async () => {
          
        // })
        // it('should NOT ALLOW Sensor Data WITHOUT sensor_id to save', async () => {

        // })
        // it('should NOT ALLOW Sensor Data WITHOUT value to save', async () => {

        // })
        // it('should NOT ALLOW Sensor Data WITHOUT timestamp to save', async () => {

        // })
      })
      // it('should NOT ALLOW Sensor Data with NON-EXISTING Activity to save', async () => {

      // });
      // it('should NOT ALLOW Sensor Data with NON-ACTIVE Activity to save', async () => {

      // });
      })
    })
  })