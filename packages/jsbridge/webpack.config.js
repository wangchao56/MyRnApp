const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'jsbridge.min.js',
    path: path.resolve(__dirname, 'dist/umd'),
    library: 'JSBridge',
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
