import request from 'supertest';
import app from '../../infrastructure/app';  // Ensure this path correctly points to your main Express app
import { UserModel } from '../../features/auth/user-model';
import { query } from '../../infrastructure/db';

// This mock path must accurately reflect the actual import paths used in your application.
jest.mock('../../features/auth/user-model', () => ({
  UserModel: {
    create: jest.fn().mockResolvedValue({ id: 1, username: 'testuser', email: 'test@example.com' }),
    findByUsername: jest.fn().mockResolvedValue({ id: 1, username: 'testuser', pass_hash: 'hashedpassword' }),
    updateVideoStatus: jest.fn().mockResolvedValue({})
  }
}));

 
describe('Auth Routes', () => {
  describe('POST /register', () => {
    describe('SUCCESS:', () => {
      it('NEW USER with VALID DATA should BE ABLE to register', async () => {
        const response = await request(app)
          .post('/auth/register')
          .send({
            email: 'user@mail.com', 
            password: 'password123',
            repeatPassword: 'password123'
          })

          // TODO
          // Should validate the email and password (INPUTS)
          // Should hash the password
          // Should save the email and hashed password to the database
          // Should respond with JSON object containing the user's id
          expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
          expect(response.body).toHaveProperty('id'); // todo use token
      }); 
    });
    describe('FAILURE:', () => {
      it('NEW USER with INVALID DATA should NOT BE ABLE to register', async () => {
        const response = await request(app)
          .post('/auth/register')
          .send({
            email: undefined,
            password: 'password123',
            repeatPassword: 'password123'
          })

          expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
          expect(response.body).toHaveProperty('error');
          expect(response.body.error).toEqual('Invalid input data.');
      });
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
          })
  
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.body).toHaveProperty('id'); // TODO use token
      });
  
      it('EXISTING USER with INVALID DATA should NOT BE ABLE to login', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({
            email: 'testuser',
          })
  
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toEqual('Invalid input data.');
      });
    });
  });

});