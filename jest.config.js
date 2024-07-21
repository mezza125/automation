module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],  
  reporters: [
    "default", 
    ["jest-html-reporters", {
      publicPath: "./html-report",
      filename: "report.html",
      expand: true,
    }]
  ],
};