const path = require('path');
const fs = require('fs');
var nodeExternals = require('webpack-node-externals');
var WebpackObfuscator = require('webpack-obfuscator');
const RemovePlugin = require('remove-files-webpack-plugin');
const filesToKeepInLib = [/src\/scripts/g, /config.js/g, /main.js/g];
const filesToGenerate = [
  {
    override: true,
    path: '${LIB_DIRECTORY}/src/main.js',
    contents: 'module.exports = { DevicePlugin : require("../bundle.js").default }',
  },
];

//Remove all files that are already bundled from lib folder
const CleanUpLibFolder = new RemovePlugin({
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

class DynamicFileGenerator {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('CreateFilePlugin', (compilation, callback) => {
      for (const file of filesToGenerate) {
        const fPath = file.path.replace('${LIB_DIRECTORY}', compilation.outputOptions.path);
        const dir = path.dirname(fPath);
        if (!file.override && fs.existsSync(fPath)) {
          break;
        }
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(fPath, file.contents);
      }
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
    new DynamicFileGenerator(),
    CleanUpLibFolder,
  ],
};
