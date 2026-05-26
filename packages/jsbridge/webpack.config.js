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
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
  },
};
