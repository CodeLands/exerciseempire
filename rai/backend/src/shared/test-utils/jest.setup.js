// Mock bcrypt globally
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('fake_hashed_password'),
  compare: jest.fn().mockResolvedValue(true)  // Assuming 'true' simulates successful password comparison
}));

// Mock axios globally in your Jest setup file or at the top of your test file
jest.mock('axios', () => {
  // Mock the create method to return a default instance with mocked functions
  const mockedAxios = {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    create: jest.fn()
  };

  // When axios.create() is called, it should return an instance that behaves the same as axios
  mockedAxios.create.mockReturnThis();

  return mockedAxios;
});