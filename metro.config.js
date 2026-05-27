const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const appRoot = path.resolve(projectRoot, 'apps/mobile');
const sharedRoot = path.resolve(projectRoot, 'packages/shared');
const shareRoot = path.resolve(projectRoot, 'packages/share');
const nativeshareRoot = path.resolve(projectRoot, 'packages/nativeshare');
const jsbridgeRoot = path.resolve(projectRoot, 'packages/jsbridge');

const config = {
  watchFolders: [appRoot, sharedRoot, shareRoot, nativeshareRoot, jsbridgeRoot, projectRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(projectRoot, 'node_modules/.pnpm/node_modules'),
      path.resolve(projectRoot, 'node_modules/@react-native-vector-icons'),
    ],
    extraNodeModules: {
      '@myapp/shared': path.resolve(sharedRoot, 'src'),
      '@myapp/share': path.resolve(shareRoot, 'src'),
      '@myapp/nativeshare': path.resolve(nativeshareRoot, 'dist/index.js'),
    },
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx'],
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
