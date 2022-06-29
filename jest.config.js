const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "." });

const customJestConfig = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  clearMocks: true,
  moduleDirectories: ["node_modules"],
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
  testRegex: "(/__tests__/.*|(\\.|/)test)\\.[jt]sx?$",
};

module.exports = createJestConfig(customJestConfig);
