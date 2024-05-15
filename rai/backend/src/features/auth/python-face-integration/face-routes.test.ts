// import request from 'supertest';
// import app from '../../../infrastructure/app'; // Adjust the import path as needed
// import axiosInstance from '../../../infrastructure/config/axios-config';
// import { UserModel } from '../user-model';

// jest.mock('UserModel', () => ({
//   updateVideoStatus: jest.fn()
// }));

// describe('Face Authentication Routes', () => {
//   beforeEach(() => {
//     (axiosInstance.post as jest.Mock).mockImplementation((url, data, options) => {
//       if (url.includes('login-face')) {
//         return Promise.resolve({ data: { recognized: true } });
//       } else if (url.includes('register-face')) {
//         return Promise.resolve({ data: { success: true } });
//       }
//       return Promise.reject(new Error('URL not found'));
//     });

//     (UserModel.updateVideoStatus as jest.Mock).mockResolvedValue({});
//   });

//   afterEach(() => {
//     jest.restoreAllMocks();
//   });

//   describe('POST /face-login', () => {
//     it('should recognize a user based on face data', async () => {
//       const res = await request(app)
//         .post('/face-login')
//         .field('userId', '1')
//         .attach('video', Buffer.from('fake_video_data', 'utf-8'), 'video.mp4');

//       expect(res.status).toBe(200);
//       expect(res.text).toEqual("Face recognized. Login successful.");
//     });

//     it('should reject a login when face is not recognized', async () => {
//       (axiosInstance.post as jest.Mock).mockResolvedValueOnce({ data: { recognized: false } });

//       const res = await request(app)
//         .post('/face-login')
//         .field('userId', '1')
//         .attach('video', Buffer.from('fake_video_data', 'utf-8'), 'video.mp4');

//       expect(res.status).toBe(401);
//       expect(res.text).toEqual("Face not recognized. Access denied.");
//     });
//   });

//   describe('POST /face-register', () => {
//     it('should initiate video processing for registration', async () => {
//       const res = await request(app)
//         .post('/face-register')
//         .field('username', 'newuser')
//         .attach('video', Buffer.from('fake_video_data', 'utf-8'), 'video.mp4');

//       expect(res.status).toBe(200);
//       expect(res.body).toEqual(expect.objectContaining({ success: true, message: "Video processing initiated and user status updated." }));
//     });

//     it('should handle failures in video processing', async () => {
//       (axiosInstance.post as jest.Mock).mockResolvedValueOnce({ data: { success: false } });

//       const res = await request(app)
//         .post('/face-register')
//         .field('username', 'newuser')
//         .attach('video', Buffer.from('fake_video_data', 'utf-8'), 'video.mp4');

//       expect(res.status).toBe(500);
//       expect(res.text).toEqual("Failed to process video.");
//     });
//   });
// });
