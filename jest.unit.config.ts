/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'test/units',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/../../src/$1',
  },
  collectCoverageFrom: [
    '../../src/**/*.ts',
    '!../../src/**/*.interface.ts',
    '!../../src/**/*.dto.ts',
    '!../../src/**/*.entity.ts',
    '!../../src/**/*.type.ts',
    '!../../src/**/*.types.ts',
    '!../../src/**/index.ts',
    '!../../src/main.ts',
  ],
  coverageDirectory: 'coverage/unit',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
