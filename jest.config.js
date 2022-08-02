const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "." });

const customJestConfig = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  clearMocks: true,
  moduleDirectories: ["node_modules"],
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
  testRegex: "(/__tests__/.*|(\\.|/)test)\\.[jt]sx?$",
  moduleNameMapper: {
    "node_modules/(.*)": "<rootDir>/node_modules/$1",
    "styles/jss/(.*)": "<rootDir>/styles/jss/$1",
    "api/(.*)": "<rootDir>/api/$1",
    "components/ImmutabilityHelper": "<rootDir>/components/ImmutabilityHelper",
    "components/LeafletTerminator": "<rootDir>/components/LeafletTerminator",
    "redux/(.*)": "<rootDir>/redux/$1",
    "pb/(.*)": "<rootDir>/pb/$1",
  },
};

module.exports = createJestConfig(customJestConfig);
