module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],

  testEnvironment: "node",

  transform: {
    "^.+\\.ts$": "ts-jest",
  },

  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/$1",
  },

  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",

  collectCoverageFrom: ["**/*.ts"],
  coverageDirectory: "../coverage",
};
