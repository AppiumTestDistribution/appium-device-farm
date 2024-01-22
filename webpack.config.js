const path = require('path');
const fs = require('fs');
var nodeExternals = require('webpack-node-externals');
var WebpackObfuscator = require('webpack-obfuscator');

class CreateLoaderFile {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
      const loaderFile = 'module.exports = { DevicePlugin : require("./bundle.js").default }';
      const outputPath = path.join(compilation.outputOptions.path, 'loader.js');
      fs.writeFileSync(outputPath, loaderFile);
      callback();
    });
  }
}

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
    new CreateLoaderFile(),
  ],
};
