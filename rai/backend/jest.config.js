module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    setupFilesAfterEnv: ['<rootDir>/src/shared/test-utils/jest.setup.js'],
    testMatch: [
      '**/__tests__/**/*.ts', // Matches any ts files in __tests__ folders
      '**/?(*.)+(spec|test).ts' // Matches any ts files ending in .spec.ts or .test.ts
    ],
    transform: {
      '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }] // New format
    },
  };
  