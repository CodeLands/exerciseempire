import 'reflect-metadata';
import request from 'supertest';
import express from 'express';
import { createApp } from '/Shared/BaseApp';
import { testContainer } from '../../../../Tests/TestContainer';
import { DbGatewayMock } from '../../../../Tests/Mocks/DB/DbGatewayMock';
import { TYPES } from '/Shared/Types';
import { AuthValidator } from '../AuthValidator';
import { AuthRepository } from '/App/Repositories/AuthRepository';
import { AuthGateway } from '/App/Services/AuthGateway';
import { JwtGateway } from '/App/Services/JwtGateway';

// Setup of Controller Dependencies
  // Mocks
let dbGateway: DbGatewayMock = null!;

  // Dependencies + Spies
let authValidator: AuthValidator = null!;
let registerDataValidateSpy: jest.Spied<typeof authValidator.registerDataValidate> = null!;
let loginDataValidateSpy: jest.Spied<typeof authValidator.loginDataValidate> = null!;

let authRepository: AuthRepository = null!;
let getUserByEmailSpy: jest.Spied<typeof authRepository.findByEmail> = null!;
let createUserSpy: jest.SpiedFunction<typeof authRepository.create> = null!;


let authGateway: AuthGateway = null!;
let comparePasswordSpy: jest.Spied<typeof authGateway.comparePassword> = null!;
let hashPasswordSpy: jest.Spied<typeof authGateway.hashPassword> = null!;

let jwtGateway: JwtGateway = null!;
let jwtSignSpy: jest.Spied<typeof jwtGateway.jwtSign> = null!;

  // App
let testApp: express.Application;
 
beforeAll(() => {
  dbGateway = testContainer.get(TYPES.DbGateway);

  authValidator = testContainer.get(TYPES.AuthValidator);
  registerDataValidateSpy = jest.spyOn(authValidator, 'registerDataValidate');
  loginDataValidateSpy = jest.spyOn(authValidator, 'loginDataValidate');

  authRepository = testContainer.get(TYPES.AuthRepository);
  getUserByEmailSpy = jest.spyOn(authRepository, 'findByEmail');
  createUserSpy = jest.spyOn(authRepository, 'create');

  authGateway = testContainer.get(TYPES.AuthGateway);
  comparePasswordSpy = jest.spyOn(authGateway, 'comparePassword');
  hashPasswordSpy = jest.spyOn(authGateway, 'hashPassword');

  jwtGateway = testContainer.get(TYPES.JwtGateway);
  jwtSignSpy = jest.spyOn(jwtGateway, 'jwtSign');

  testApp = createApp(testContainer);
}); 

describe('Auth Routes:', () => { 
  // beforeEach(() => {
    
  // });

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('POST /login Route:', () => {
    describe('Successfull cases:', () => {
      it('should ALLOW EXISTING User, with VALID Payload to Successfully Login', async () => {
        // Setup mocks
        const dbMockedDataGetUserByEmail = [{
          id: 1,
          email: 'test@test.com',
          pass_hash: '$2a$12$eiX9CbgJVMIbiokryXXBDOOkCGEvBk0noV6EXplMdT5UjrpsvKKR6'
        }]
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
        expect(comparePasswordSpy).toHaveBeenCalledTimes(1);
        expect(comparePasswordSpy).toHaveBeenCalledWith(payload.password, dbMockedDataGetUserByEmail[0].pass_hash);

          // JWT gets signed
        expect(jwtSignSpy).toHaveBeenCalledTimes(1);
        expect(jwtSignSpy).toHaveBeenCalledWith(dbMockedDataGetUserByEmail[0].id);

          // Response
        expect(response.body).toEqual({
          success: true,
          message: "User Logged in Successfully!",
          data: {
            token: "eyJhbGciOiJIUzI1NiJ9.MQ.9i70t-D_BlCv7q6nRiwv7ZQlp3CMjC8xAGvlzqjViYY"
          },
        });
      });
    })
    describe('Failed cases:', () => {
      describe('INVALID Payload:', () => {
        // it('should NOT ALLOW User, with INVALID Password to Login', async () => {
          
        // })
        // it('should NOT ALLOW User, with INVALID Email to Login', async () => {

        // })
      })
      it('should NOT ALLOW NON-EXISTING User to Login', async () => {
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

  describe('POST /register Route:', () => {
    describe('Successfull cases:', () => {
      it('should allow NEW User, with VALID Payload to Successfully Register', async () => {
        // Setup mocks
        const dbMockedDataGetUserByEmail: [] = []
        const dbMockedDataCreateUser = [{
          id: 1,
          email: 'test@test.com',
          pass_hash: '$2a$12$eiX9CbgJVMIbiokryXXBDOOkCGEvBk0noV6EXplMdT5UjrpsvKKR6'
        }]

        dbGateway.query = jest.fn().mockResolvedValueOnce({
          dbSuccess: true,
          data: dbMockedDataGetUserByEmail
        }).mockResolvedValueOnce({
          dbSuccess: true,
          data: dbMockedDataCreateUser
        });
        
        // Call BlackBox / System Under Test
        const payload = {
          email: 'test@test.com',
          password: 'password',
            repeatPassword: 'password'
        }
        const response = await request(testApp).post('/register').send(payload);

        // Expectations
          // Validation
        expect(registerDataValidateSpy).toHaveBeenCalledTimes(1);
        expect(registerDataValidateSpy).toHaveBeenCalledWith(payload.email, payload.password, payload.repeatPassword);

          // Repository check for user existance
        expect(dbGateway.query).toHaveBeenCalledTimes(2);
        expect(dbGateway.query).toHaveBeenNthCalledWith(1, 'SELECT * FROM UsersAuth WHERE email = $1', [payload.email]);
        expect(dbGateway.query).toHaveBeenNthCalledWith(2, 'INSERT INTO UsersAuth (email, pass_hash, hasset2fa) VALUES ($1, $2, false) RETURNING *', [payload.email, expect.any(String)]);

          // Password gets hashed
        expect(hashPasswordSpy).toHaveBeenCalledTimes(1);
        expect(hashPasswordSpy).toHaveBeenCalledWith(payload.password);

          // JWT gets signed
        expect(jwtSignSpy).toHaveBeenCalledTimes(1);
        //expect(jwtSignSpy).toHaveBeenCalledWith(dbMockedDataCreateUser[0].id);

          // Response
        expect(response.body).toEqual({
          success: true,
          message: "User Registered Successfully!",
          data: {
            token: "eyJhbGciOiJIUzI1NiJ9.MQ.9i70t-D_BlCv7q6nRiwv7ZQlp3CMjC8xAGvlzqjViYY"
          },
          });
          
      });
    })
  })