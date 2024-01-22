const path = require('path');
var nodeExternals = require('webpack-node-externals');
var WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  entry: ['./lib/src/index.js'],
  externals: [nodeExternals()],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'lib'),
    library: {
      type: 'umd',
    },
  },
  optimization: { minimize: true },
  target: 'node',
  externalsPresets: {
    node: true,
  },
  mode: 'production',
  plugins: [
    new WebpackObfuscator({
      rotateStringArray: true,
      splitStrings: true,
      target: 'node',
      identifierNamesGenerator: 'mangled-shuffled',
    }),
  ],
};
