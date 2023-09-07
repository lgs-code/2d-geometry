module.exports = {
    preset: 'ts-jest',
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    collectCoverage: true,
    collectCoverageFrom:[
      './dist/*.js', 
      '!./dist/index.js',
      '!**/node_modules/**'
    ],
    coverageDirectory: "./dist/coverage",
    coverageThreshold:{
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: -10,
      }
    }
  };