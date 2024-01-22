const path = require('path');
var nodeExternals = require('webpack-node-externals');
module.exports = {
  entry: ['./lib/src/index.js'],
  externals: [nodeExternals()],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'lib'),
    library: 'DevicePlugin',
    libraryTarget: 'umd',
  },
  optimization: { minimize: true },
  target: 'node',
  externalsPresets: {
    node: true,
  },
  mode: 'production',
};
