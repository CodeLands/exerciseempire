// Jest setup file
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn()
  };
  return { Pool: jest.fn(() => mPool) };
});

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('fake_hashed_password')
}));

jest.mock('../../infrastructure/db', () => ({
  query: jest.fn().mockResolvedValue({
    rows: [{ id: 1, username: 'testuser', email: 'test@example.com', pass_hash: 'fake_hashed_password' }]
  })
}));

// Mocking UserModel with Jest
jest.mock('../../features/auth/user-model', () => ({
  create: jest.fn().mockResolvedValue({
    id: 1,
    username: 'testuser',
    email: 'test@example.com'
  }),
  findByUsername: jest.fn().mockResolvedValue({
    id: 1,
    username: 'testuser',
    pass_hash: 'hashedpassword'
  })
}));

// Exporting a function to reset mocks is not typically needed as Jest automatically isolates mocks between tests
