/** @type {import('jest').Config} */
module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'test/units',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/../../src/$1'
    },
    collectCoverageFrom: ['../../src/**/*.ts'],
    coverageDirectory: 'coverage/unit',
    testEnvironment: 'node',
  };
  