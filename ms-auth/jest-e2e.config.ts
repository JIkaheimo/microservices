module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],

  testEnvironment: 'node',

  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
  },

  rootDir: 'src',
  testRegex: '.*\\.e2e.spec\\.ts$',

  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',

  setupFilesAfterEnv: ['<rootDir>/e2e/setup.ts'],
};
