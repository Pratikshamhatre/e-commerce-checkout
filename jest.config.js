const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
     '^@/(.*)$': '<rootDir>/$1',
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

module.exports = createJestConfig(customJestConfig);
