module.exports = {
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@myapp/shared(.*)$': '<rootDir>/packages/shared/src$1',
    '^@myapp/jsbridge(.*)$': '<rootDir>/packages/jsbridge/dist/cjs$1',
    'react-native$': 'react-native-web',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-web|@myapp)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'packages/**/src/**/*.{ts,tsx}',
    '!packages/**/src/**/*.d.ts',
    '!packages/**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
