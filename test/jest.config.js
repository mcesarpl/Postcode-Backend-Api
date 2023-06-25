const { resolve } = require('path');
const root = resolve(__dirname, '..');
const rootConfig = require(`${root}/jest.config.js`);

module.exports = {
  ...rootConfig,
  rootDir: root,
  displayName: "integration-tests",
  testMatch: ["<rootDir>/test/**/*.spec.ts"],
}