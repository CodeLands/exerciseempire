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
    it('should register a new user correctly', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123'
        });
  
      expect(response.statusCode).toBe(201);
      expect(UserModel.create).toHaveBeenCalled();
      // Ensure that query is called with expected parameters
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),  // Check if the query string contains expected SQL command
        expect.arrayContaining(['newuser', 'new@example.com', expect.any(String)])
      );
    });
  });

  describe('POST /login', () => {
    it('should log in an existing user', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'password123' })
        .expect(200);

      expect(res.body).toHaveProperty('username', 'testuser');
    });

    it('should reject a login attempt with the wrong password', async () => {
      // Setup a mock to simulate a failed login attempt
      (UserModel.findByUsername as jest.Mock).mockResolvedValueOnce({
        id: 1,
        username: 'testuser',
        pass_hash: 'incorrect_hashedpassword'
      });

      const res = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' })
        .expect(401);

      expect(res.body).toHaveProperty('error', 'Invalid credentials provided.');
    });
  });

  // Additional test cases can be added here
});
