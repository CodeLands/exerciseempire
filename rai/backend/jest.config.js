module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
      '^/Shared/(.*)$': '<rootDir>/src/Shared/$1',
      '^/App/(.*)$': '<rootDir>/src/App/$1',
    },
    transform: {
      '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
    },
  };
  