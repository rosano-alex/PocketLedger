// Shares webpack's Babel pipeline so tests compile like the bundle does.
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '\\.css$': '<rootDir>/test/styleStub.cjs',
  },
  transform: {
    '^.+\\.[cm]?[jt]sx?$': 'babel-jest',
  },
  // These ship untranspiled sources, so they must go through Babel.
  transformIgnorePatterns: [
    'node_modules/(?!(react-native-web|react-native-svg|@gluestack-ui|@gluestack-style|@react-native-aria|@react-stately|@react-aria|@legendapp|@codigos)/)',
  ],
  moduleFileExtensions: ['web.tsx', 'web.ts', 'web.js', 'tsx', 'ts', 'jsx', 'js', 'json'],
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.test.tsx'],
};
