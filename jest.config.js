/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */


process.env = Object.assign(process.env, {
  MONGODB_URI: 'mongodb://localhost:27017/nodejs_auth_server_test',
})

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "@exmpl/(.*)": "<rootDir>/src/$1"
  },
  globals: {
    'ts-jest': {
        isolatedModules: true
    }
  },
};