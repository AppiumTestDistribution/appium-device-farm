const path = require('path');
const fs = require('fs');
var nodeExternals = require('webpack-node-externals');
var WebpackObfuscator = require('webpack-obfuscator');
const RemovePlugin = require('remove-files-webpack-plugin');
const filesToKeepInLib = [/src\/scripts/g, /config.js/g, /main.js/g];

//Remove all files that are already bundled from lib folder
const distCleanUpPlugin = new RemovePlugin({
  after: {
    root: './lib',
    test: [
      {
        folder: './src',
        method: (file) => {
          return filesToKeepInLib.reduce((flag, f) => flag && !new RegExp(f).test(file), true);
        },
        recursive: true,
      },
    ],
  },
});

class CreateLoaderFile {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
      const loaderFile = 'module.exports = { DevicePlugin : require("../bundle.js").default }';
      const outputPath = path.join(compilation.outputOptions.path, 'src', 'main.js');
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
  devtool: 'nosources-source-map',
  plugins: [
    new WebpackObfuscator({
      rotateStringArray: true,
      splitStrings: true,
      target: 'node',
      identifierNamesGenerator: 'mangled-shuffled',
      sourceMap: true,
    }),
    new CreateLoaderFile(),
    //distCleanUpPlugin,
  ],
};
