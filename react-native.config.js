const path = require('path');

module.exports = {
  project: {
    android: {
      sourceDir: path.join(__dirname, 'packages/app/android'),
    },
    ios: {
      sourceDir: path.join(__dirname, 'packages/app/ios'),
    },
  },
};
