const path = require('path');
const fs = require('fs');
var nodeExternals = require('webpack-node-externals');
var WebpackObfuscator = require('webpack-obfuscator');
const RemovePlugin = require('remove-files-webpack-plugin');
const filesToKeepInLib = [/src\/scripts/g, /config.js/g, /main.js/g];
const filesToGenerate = [
  {
    override: true,
    path: 'lib/src/main.js',
    contents: 'module.exports = { DevicePlugin : require("../bundle.js").default }',
  },
  {
    override: false,
    path: 'lib/src/modules/index.js',
    contents: 'module.exports = require("../fake-module-loader.js").FakeModuleLoader;',
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
    compiler.hooks.compile.tap('CreateFilePlugin', () => {
      for (const file of filesToGenerate) {
        const fPath = file.path;
        const dir = path.dirname(fPath);
        if (!file.override && fs.existsSync(fPath)) {
          break;
        }
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(fPath, file.contents);
      }
    });
  }
}

const getExtendedWebpackConfig = function () {
  return fs.existsSync(path.join(__dirname, 'src/modules/webpack.config.js'))
    ? './src/modules/webpack.config.js'
    : undefined;
};

module.exports = {
  extends: getExtendedWebpackConfig(),
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
    new DynamicFileGenerator(),
    new WebpackObfuscator({
      rotateStringArray: true,
      splitStrings: true,
      target: 'node',
      identifierNamesGenerator: 'mangled-shuffled',
      sourceMap: true,
      transformObjectKeys: true,
      unicodeEscapeSequence: true,
      stringArray: true,
    }),
    CleanUpLibFolder,
  ],
};
