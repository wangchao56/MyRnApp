const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';
const transpileModules = ['react-native', '@react-native', 'react-native-vector-icons', '@react-native-vector-icons'];

const shouldTranspileModule = modulePath => {
  const normalizedPath = modulePath.replace(/\\/g, '/');
  return transpileModules.some(
    moduleName =>
      normalizedPath.includes(`/node_modules/${moduleName}/`) ||
      normalizedPath.includes(`/node_modules/.pnpm/${moduleName.replace('/', '+')}@`),
  );
};

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: path.resolve(__dirname, 'src/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    publicPath: '/',
  },
  devtool: isDevelopment ? 'source-map' : false,
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.js', '.json'],
    alias: {
      'react-native$': 'react-native-web',
      '@react-native-vector-icons/get-image': path.resolve(__dirname, 'src/shims/ReactNativeVectorIconsGetImage.js'),
      'react-native-vector-icons': path.resolve(
        __dirname,
        '../../node_modules/.pnpm/react-native-vector-icons@10.3.0/node_modules/react-native-vector-icons',
      ),
      '@myapp/shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: 'babel-loader',
        exclude: modulePath => /node_modules/.test(modulePath) && !shouldTranspileModule(modulePath),
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(ttf|otf|woff2?)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^\.\/NativeRNVectorIcons$/, resource => {
      const context = resource.context.replace(/\\/g, '/');
      if (context.endsWith('/react-native-vector-icons/lib')) {
        resource.request = path.resolve(__dirname, 'src/shims/NativeRNVectorIcons.js');
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
    }),
  ],
  devServer: {
    port: 3000,
    host: '0.0.0.0',
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
