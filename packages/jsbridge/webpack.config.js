const path = require('path');

// 与 src/umd-global.ts 中 UMD_GLOBAL_NAME 保持一致
const UMD_GLOBAL_NAME = 'JSBridge';

module.exports = {
  entry: './src/umd.ts',
  output: {
    filename: 'jsbridge.min.js',
    path: path.resolve(__dirname, 'dist/umd'),
    library: UMD_GLOBAL_NAME,
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@myapp/share': path.resolve(__dirname, '../share/src'),
      '@myapp/nativeshare': path.resolve(__dirname, '../nativeshare/dist/index.js'),
      'react-native$': path.resolve(__dirname, 'src/shims/react-native.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: path.resolve(__dirname, 'tsconfig.webpack.json'),
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
  },
};
