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
  // The logic tests moved to shared with the code they cover, and are run
  // from here so one command still proves everything the web app relies on.
  roots: ['<rootDir>/src', '<rootDir>/../shared/src'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
};
