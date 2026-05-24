const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const appRoot = path.resolve(projectRoot, 'apps/app');
const sharedRoot = path.resolve(projectRoot, 'packages/shared');
const jsbridgeRoot = path.resolve(projectRoot, 'packages/jsbridge');

const config = {
  watchFolders: [appRoot, sharedRoot, jsbridgeRoot, projectRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(projectRoot, 'node_modules/.pnpm/node_modules'),
      path.resolve(projectRoot, 'node_modules/@react-native-vector-icons'),
    ],
    extraNodeModules: {
      '@myapp/shared': path.resolve(sharedRoot, 'src'),
      '@myapp/jsbridge': path.resolve(jsbridgeRoot, 'src'),
      '@react-native-vector-icons/material-icons': path.resolve(projectRoot, 'node_modules/@react-native-vector-icons/material-icons'),
    },
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx'],
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
