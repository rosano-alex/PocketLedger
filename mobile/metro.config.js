const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
// The shared package is a symlink into the repo, so Metro resolves its files
// at their real path. That path has to be watched explicitly or every import
// out of it is "outside the project root".
const sharedRoot = path.resolve(projectRoot, '../shared');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [sharedRoot];

// Shared ships TypeScript source and reaches for react, zustand and
// react-query from inside the repo — where the web app's copies also live.
// Pinning resolution to this app's node_modules and switching off the upward
// walk is what keeps React a singleton; two copies would break every hook in
// the shared store.
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];
config.resolver.disableHierarchicalLookup = true;

// `@pocketledger/shared/store` and friends are subpath exports.
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
