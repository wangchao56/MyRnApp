module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {browsers: 'last 2 versions'}, modules: 'commonjs'}],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [['@babel/plugin-proposal-decorators', {legacy: true}], '@babel/plugin-transform-flow-strip-types'],
};
