const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const sharedRoot = path.resolve(workspaceRoot, 'packages/shared');

const config = {
  watchFolders: [projectRoot, sharedRoot, workspaceRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules/.pnpm/node_modules'),
    ],
    extraNodeModules: {
      '@myapp/shared': path.resolve(workspaceRoot, 'packages/shared/src'),
    },
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx'],
  },
  server: {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        console.log(`Request: ${req.url}`);
        return middleware(req, res, next);
      };
    },
  },
};

const defaultConfig = getDefaultConfig(__dirname);
console.log('Metro config loaded:', {
  watchFolders: config.watchFolders,
  projectRoot,
  nodeModulesPaths: config.resolver.nodeModulesPaths,
});

module.exports = mergeConfig(defaultConfig, config);