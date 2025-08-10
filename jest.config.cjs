const nextJest = require("next/jest");

const transformIgnores = [
  ".*-markdown",
  "@adaptivekind/markdown",
  ".*-separated-tokens",
  "bail",
  "decode",
  "devlop",
  "estree-util-is-identifier-name",
  "hast",
  "html",
  "is-plain-obj",
  "mdast",
  "micromark",
  "property-information",
  "remark",
  "trim",
  "trough",
  "unified",
  "unist",
  "vfile",
].join("|");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  testMatch: ["**/src/**/*.test.{ts,tsx}"],
  collectCoverageFrom: [
    "src/**/*.{js,ts,tsx}",
    "!src/pages/_app.tsx",
    "!src/pages/_document.tsx",
  ],
  transformIgnorePatterns: [`/node_modules/(?!${transformIgnores})`],
};

const asyncConfig = createJestConfig(customJestConfig);

module.exports = async () => {
  const config = await asyncConfig();
  config.transformIgnorePatterns = customJestConfig.transformIgnorePatterns;
  return config;
};
