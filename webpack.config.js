var path = require('path');

module.exports = {
  entry: './src/yom-json-validator.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'yom-json-validator.js',
    library: 'YomJsonValidator',
    libraryTarget: 'umd'
  }
};
