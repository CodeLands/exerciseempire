import 'reflect-metadata';
import request from 'supertest';
import express from 'express';
import { createApp } from '/Shared/BaseApp';
import { testContainer } from '../../../../Tests/TestContainer';
import { DbGatewayMock } from '../../../../Tests/Mocks/DB/DbGatewayMock';
import { TYPES } from '/Shared/Types';
import { SensorDataValidator } from '../SensorDataValidator';
import { SensorDataRepository } from '/App/Repositories/SensorDataRepository';

// Setup of Controller Dependencies
  // Mocks
let dbGateway: DbGatewayMock = null!;

  // Dependencies + Spies
let sensorDataValidator: SensorDataValidator = null!;
let sensorDataValidateSpy: jest.Spied<typeof sensorDataValidator.sensorDataValidate> = null!;

let sensorDataRepository: SensorDataRepository = null!;
let checkActivityIsActiveSpy: jest.Spied<typeof sensorDataRepository.checkActivityIsActive> = null!;
let createSensorDataSpy: jest.Spied<typeof sensorDataRepository.create> = null!;

// TO ADD - ActivityRepository

  // App
let testApp: express.Application;
 
beforeAll(() => {
  dbGateway = testContainer.get(TYPES.DbGateway);

  sensorDataValidator = testContainer.get(TYPES.SensorDataValidator);
  sensorDataValidateSpy = jest.spyOn(sensorDataValidator, 'sensorDataValidate');

  sensorDataRepository = testContainer.get(TYPES.SensorDataRepository);
  checkActivityIsActiveSpy = jest.spyOn(sensorDataRepository, 'checkActivityIsActive');
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
        // Setup mocks - TODO
        const dbMockedCheckActivityIsActive = [{
          id: 1,
          active: true,
        }]
        const dbMockedCreateSensorData = [{
          id: 1,
          activity_id: 1,
          sensor_id: 1,
          value: 1,
          created_at: new Date(),
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
          activity_id: 1,
          sensor_id: 1,
          value: 1,
          timestamp: new Date(),
        }
        const response = await request(testApp).post('/sensor-data').send(payload);

        // Expectations
          // Validation
        expect(sensorDataValidateSpy).toHaveBeenCalledTimes(1);
        expect(sensorDataValidateSpy).toHaveBeenCalledWith(payload.activity_id, payload.sensor_id, payload.value, payload.timestamp);

          // Repository check if associated activity is active
        expect(checkActivityIsActiveSpy).toHaveBeenCalledTimes(1);
        expect(checkActivityIsActiveSpy).toHaveBeenCalledWith(payload.activity_id);

          // Check if repository called dbGateway.query
        expect(dbGateway.query).toHaveBeenCalledTimes(1);
        expect(dbGateway.query).toHaveBeenCalledWith('');

          // Repository creates sensor data entry
        expect(createSensorDataSpy).toHaveBeenCalledTimes(1);
        expect(createSensorDataSpy).toHaveBeenCalledWith(payload.activity_id, payload.sensor_id, payload.value, payload.timestamp);

          // Check if repository called dbGateway.query
        expect(dbGateway.query).toHaveBeenCalledTimes(2);
        expect(dbGateway.query).toHaveBeenCalledWith('');

          // Response
        expect(response.body).toEqual({
          success: true,
          message: "Sensor Data Saved Successfully!",
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
      it('should NOT ALLOW Sensor Data with NON-EXISTING Activity to save', async () => {
        // Setup mocks
        const dbMockedDataGetUserByEmail: [] = []
        dbGateway.query = jest.fn().mockResolvedValueOnce({
          dbSuccess: true,
          data: dbMockedDataGetUserByEmail
        });
        
        // Call BlackBox / System Under Test
        const payload = {
          email: 'test@test.com',
          password: 'password',
        }
        const response = await request(testApp).post('/login').send(payload);

        // Expectations
          // Validation
        expect(loginDataValidateSpy).toHaveBeenCalledTimes(1);
        expect(loginDataValidateSpy).toHaveBeenCalledWith(payload.email, payload.password);

          // Repository check for user existance
        expect(dbGateway.query).toHaveBeenCalledTimes(1);
        expect(dbGateway.query).toHaveBeenCalledWith('SELECT * FROM UsersAuth WHERE email = $1', [payload.email]);

          // Password gets compared
        expect(comparePasswordSpy).toHaveBeenCalledTimes(0);

          // Response
        expect(response.body).toEqual({
          success: false,
          errors: ["DB: User not found!"],
        });
      });
      it('should NOT ALLOW Sensor Data with NON-ACTIVE Activity to save', async () => {
        // Setup mocks
        const dbMockedDataGetUserByEmail: [] = []
        dbGateway.query = jest.fn().mockResolvedValueOnce({
          dbSuccess: true,
          data: dbMockedDataGetUserByEmail
        });
        
        // Call BlackBox / System Under Test
        const payload = {
          email: 'test@test.com',
          password: 'password',
        }
        const response = await request(testApp).post('/login').send(payload);

        // Expectations
          // Validation
        expect(loginDataValidateSpy).toHaveBeenCalledTimes(1);
        expect(loginDataValidateSpy).toHaveBeenCalledWith(payload.email, payload.password);

          // Repository check for user existance
        expect(dbGateway.query).toHaveBeenCalledTimes(1);
        expect(dbGateway.query).toHaveBeenCalledWith('SELECT * FROM UsersAuth WHERE email = $1', [payload.email]);

          // Password gets compared
        expect(comparePasswordSpy).toHaveBeenCalledTimes(0);

          // Response
        expect(response.body).toEqual({
          success: false,
          errors: ["DB: User not found!"],
        });
      });
      })
    })
  })