module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
  moduleNameMapper: {
    '^@PACKAGE_JSON$': '<rootDir>/package.json',
    '^@server/(.*)$': '<rootDir>/server/$1',
  },
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './reports',
      outputName: 'junit.xml',
    }],
  ],
};
