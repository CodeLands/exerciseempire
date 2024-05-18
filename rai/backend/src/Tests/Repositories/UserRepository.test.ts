// import 'reflect-metadata';
// import { UserRepository } from '/App/Repositories/UserRepository';
// import { DbGateway } from '/App/Services/DbGateway';
// import { testContainer } from '../TestContainer';
// import { TYPES } from '/Shared/Types';

// describe('UserRepository', () => {
//   let userRepository: UserRepository; 

//   const dbGateway: DbGateway = testContainer.get<DbGateway>(TYPES.DbGateway);

//   beforeEach(() => {
//     userRepository = new UserRepository();
//   });

//   it('should return a list of users', async () => {
//     const users = await userRepository.findAll();
//     expect(users).toEqual([{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }]);
//   });

//   it('should return a user by ID', async () => {
//     const mockUser = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
//     const user = await userRepository.findById(1);
//     expect(user).toEqual(mockUser);
//   });

//   it('should update an existing user', async () => {
//     const updatedUser = { email: 'john.smith@example.com', pass_hash: "test" };
//     await userRepository.update(1, updatedUser);
//     expect(dbGateway.pool.query).toHaveBeenCalledWith('UPDATE users SET email = $2, pass_hash = $3 WHERE id = $1', [1, updatedUser.email, updatedUser.pass_hash]);
//   });

//   it('should delete a user', async () => {
//     await userRepository.delete(1);
//     expect(dbGateway.pool.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1', [1]);
//   });
// });
