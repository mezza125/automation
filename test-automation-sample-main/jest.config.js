module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],  
  reporters: [
    "default", // Keep the default reporter for console output
    ["jest-html-reporters", {
      publicPath: "./html-report",
      filename: "report.html",
      expand: true,
    }]
  ],
};