const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';
const webBabelConfig = path.resolve(__dirname, 'packages/web/babel.config.js');
const transpileModules = [
  'react-native',
  '@react-native',
  'react-native-vector-icons',
  '@react-native-vector-icons',
  'react-native-swiper-flatlist',
];

const webDir = path.resolve(__dirname, 'packages/web');

const shouldTranspileModule = modulePath => {
  const normalizedPath = modulePath.replace(/\\/g, '/');
  return transpileModules.some(moduleName => {
    const pnpmSegment = moduleName.replace('@', '').replace('/', '+');
    return (
      normalizedPath.includes(`/node_modules/${moduleName}/`) ||
      normalizedPath.includes(`/node_modules/.pnpm/${pnpmSegment}@`)
    );
  });
};

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: path.resolve(webDir, 'src/index.tsx'),
  output: {
    path: path.resolve(webDir, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    publicPath: '/',
  },
  devtool: isDevelopment ? 'source-map' : false,
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js', '.json'],
    mainFields: ['browser', 'module', 'main'],
    alias: {
      'react-native$': 'react-native-web',
      '@react-native-vector-icons/get-image': path.resolve(webDir, 'src/shims/ReactNativeVectorIconsGetImage.js'),
      'react-native-vector-icons': path.resolve(
        __dirname,
        'node_modules/.pnpm/react-native-vector-icons@10.3.0/node_modules/react-native-vector-icons',
      ),
      'react-native-swiper-flatlist': path.resolve(
        __dirname,
        'node_modules/.pnpm/react-native-swiper-flatlist@3.2.5_react-native@0.74.7/node_modules/react-native-swiper-flatlist',
      ),
      '@myapp/shared': path.resolve(__dirname, 'packages/shared/src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: webBabelConfig,
          },
        },
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
        resource.request = path.resolve(webDir, 'src/shims/NativeRNVectorIcons.js');
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
      directory: path.resolve(webDir, 'public'),
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
