const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootDir = path.resolve(__dirname, '../..');
const webDir = __dirname;
const jsbridgeUmdDir = path.resolve(rootDir, 'packages/jsbridge/dist/umd');
const jsbridgeUmdPath = path.resolve(jsbridgeUmdDir, 'jsbridge.min.js');
const isDevelopment = process.env.NODE_ENV !== 'production';

class EmitJsbridgeUmdPlugin {
  apply(compiler) {
    const {WebpackError, sources} = compiler.webpack;
    compiler.hooks.thisCompilation.tap('EmitJsbridgeUmdPlugin', compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: 'EmitJsbridgeUmdPlugin',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          if (!fs.existsSync(jsbridgeUmdPath)) {
            compilation.errors.push(
              new WebpackError(
                `jsbridge UMD not found at ${jsbridgeUmdPath}. Run "pnpm build:jsbridge" first.`,
              ),
            );
            return;
          }
          compilation.emitAsset('jsbridge.min.js', new sources.RawSource(fs.readFileSync(jsbridgeUmdPath)));
        },
      );
    });
  }
}
const webBabelConfig = path.resolve(webDir, 'babel.config.js');
const transpileModules = [
  'react-native',
  '@react-native',
  '@react-native-vector-icons',
  'react-native-swiper-flatlist',
];

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
      'expo-font': path.resolve(webDir, 'src/shims/empty.js'),
      '@react-native-clipboard/clipboard': path.resolve(webDir, 'src/shims/react-native-clipboard.js'),
      'react-native-swiper-flatlist': path.resolve(rootDir, 'node_modules/react-native-swiper-flatlist'),
      '@myapp/shared': path.resolve(rootDir, 'packages/shared/src'),
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
    new EmitJsbridgeUmdPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, 'public/index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
  ],
  devServer: {
    port: 3000,
    host: '0.0.0.0',
    hot: true,
    historyApiFallback: true,
    static: [
      {
        directory: path.resolve(webDir, 'public'),
      },
      {
        directory: jsbridgeUmdDir,
        publicPath: '/',
        watch: true,
      },
    ],
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
