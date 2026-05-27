const path = require('path');
const rspack = require('@rspack/core');

const isDevelopment = process.env.NODE_ENV !== 'production';
const appDir = path.resolve(__dirname, 'apps/mobile');
const webDir = path.resolve(__dirname, 'apps/web');

const transpileModules = [
  'react-native',
  '@react-native',
  '@react-navigation',
  'react-native-screens',
  'react-native-vector-icons',
  '@react-native-vector-icons',
  'react-native-swiper-flatlist',
];

const shouldTranspileModule = modulePath => {
  const normalizedPath = modulePath.replace(/\\/g, '/');
  return transpileModules.some(
    moduleName =>
      normalizedPath.includes(`/node_modules/${moduleName}/`) ||
      normalizedPath.includes(`/node_modules/.pnpm/${moduleName.replace('/', '+')}@`) ||
      normalizedPath.includes(`/node_modules/.pnpm/${moduleName.replace('@', '').replace('/', '+')}@`),
  );
};

/** @type {import('@rspack/core').Configuration} */
module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: path.resolve(appDir, 'index.web.js'),
  output: {
    path: path.resolve(appDir, 'dist'),
    filename: isDevelopment ? '[name].js' : 'bundle.[contenthash].js',
    clean: true,
    publicPath: '/',
  },
  devtool: isDevelopment ? 'source-map' : false,
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native-safe-area-context': path.resolve(webDir, 'src/shims/react-native-safe-area-context.js'),
      'react-native-screens': path.resolve(webDir, 'src/shims/empty.js'),
      'react-native-vector-icons': path.resolve(webDir, 'src/shims/empty.js'),
      '@react-native/assets-registry': path.resolve(webDir, 'src/shims/empty.js'),
      '@react-native/assets-registry/registry': path.resolve(webDir, 'src/shims/empty.js'),
      '@react-native/assets-registry/path-support': path.resolve(webDir, 'src/shims/empty.js'),
      '@react-native-vector-icons/get-image': path.resolve(webDir, 'src/shims/ReactNativeVectorIconsGetImage.js'),
      'expo-font': path.resolve(webDir, 'src/shims/empty.js'),
      '@react-native-clipboard/clipboard': path.resolve(webDir, 'src/shims/react-native-clipboard.js'),
      'react-native-swiper-flatlist': path.resolve(
        __dirname,
        'node_modules/.pnpm/react-native-swiper-flatlist@3.2.5_react-native@0.74.7/node_modules/react-native-swiper-flatlist',
      ),
      '@myapp/shared': path.resolve(__dirname, 'packages/shared/src'),
      '@myapp/share': path.resolve(__dirname, 'packages/share/src'),
      '@myapp/nativeshare': path.resolve(__dirname, 'packages/nativeshare/dist/index.js'),
      '@react-native-oh-library/react-native-share': path.resolve(webDir, 'src/shims/empty.js'),
      'react-native-share': path.resolve(webDir, 'src/shims/empty.js'),
    },
  },
  module: {
    rules: [
      // third-party RN packages need transpiling — use babel with flow strip
      {
        test: /\.[jt]sx?$/,
        include: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            configFile: path.resolve(__dirname, 'apps/web/babel.config.js'),
            cacheDirectory: true,
          },
        },
        exclude: modulePath => !shouldTranspileModule(modulePath),
      },
      // project source files — use fast SWC loader
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {syntax: 'typescript', tsx: true, decorators: true},
              transform: {
                react: {runtime: 'automatic'},
                legacyDecorator: true,
                decoratorMetadata: true,
              },
            },
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/,
        type: 'asset/resource',
        generator: {filename: 'assets/images/[name][ext]'},
      },
      {
        test: /\.(ttf|otf|woff2?)$/,
        type: 'asset/resource',
        generator: {filename: 'assets/fonts/[name][ext]'},
      },
    ],
  },
  experiments: {
    css: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new rspack.NormalModuleReplacementPlugin(/^\.\/NativeRNVectorIcons$/, resource => {
      const context = resource.context.replace(/\\/g, '/');
      if (context.endsWith('/react-native-vector-icons/lib')) {
        resource.request = path.resolve(webDir, 'src/shims/NativeRNVectorIcons.js');
      }
    }),
    new rspack.HtmlRspackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
    }),
  ],
  devServer: {
    port: 3002,
    host: '0.0.0.0',
    hot: true,
    historyApiFallback: true,
    static: {directory: path.resolve(webDir, 'public')},
    headers: {'Access-Control-Allow-Origin': '*'},
  },
};
