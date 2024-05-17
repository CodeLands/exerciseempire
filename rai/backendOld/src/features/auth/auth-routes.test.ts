import request from 'supertest';
import app from '../../infrastructure/app';  // Ensure this path correctly points to your main Express app
import { UserModel } from './user-model';
import { query } from '../../infrastructure/db';
import { Pool } from 'pg';

require("dotenv").config();

const pool = new Pool();

beforeAll(async () => {
  // Ensure database connections or other necessary initial setups
});

afterAll(async () => {
  // Properly close the database connection
  await pool.end();
});

describe('Auth Routes', () => {
  describe('POST /register', () => {
    describe('SUCCESS:', () => {
      it('NEW USER with VALID DATA should BE ABLE to register', async () => {
        const payload = {
          email: 'user@mail.com', 
          password: 'password123',
          repeatPassword: 'password123'
        };
        
        const response = await request(app)
          .post('/auth/register')
          .send(payload);
        
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.body).toHaveProperty('id'); // TODO: use token
      }); // Increased timeout to 10 seconds
    });

    describe('FAILURE:', () => {
      it('NEW USER with INVALID DATA should NOT BE ABLE to register', async () => {
        const response = await request(app)
          .post('/auth/register')
          .send({
            email: undefined,
            password: 'password123',
            repeatPassword: 'password123'
          });

        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toEqual('Invalid input data.');
      }); // Increased timeout to 10 seconds
    });
  });

  describe('POST /login', () => {
    describe('SUCCESS:', () => {
      it('EXISTING USER with VALID DATA should BE ABLE to login', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: 'testuser',
            password: 'password123'
          });
        
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.body).toHaveProperty('id'); // TODO: use token
      }); // Increased timeout to 10 seconds
    });

    describe('FAILURE:', () => {
      it('EXISTING USER with INVALID DATA should NOT BE ABLE to login', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: 'testuser',
            password: ''  // Ensure to include invalid password for failure case
          });

        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toEqual('Invalid input data.');
      }); // Increased timeout to 10 seconds
    });
  });
});
