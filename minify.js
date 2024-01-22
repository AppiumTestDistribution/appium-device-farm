const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');

function minifyFile(filePath) {
  const options = {
    mangle: {
      toplevel: true,
    },
    compress: true,
  };
  const code = fs.readFileSync(filePath, 'utf8');
  const result = UglifyJS.minify(code, options);
  if (result.code) {
    fs.writeFileSync(filePath, result.code, 'utf8');
  }
}

function traverseFolder(folderPath) {
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // Recursively traverse subdirectories
      traverseFolder(filePath);
    } else if (stats.isFile() && path.extname(filePath) === '.js') {
      // Minify JavaScript files
      minifyFile(filePath);
    }
  });
}

// Specify the root folder where you want to start the process
traverseFolder(path.join(__dirname, 'lib', 'src'));
traverseFolder(path.join(__dirname, 'lib', 'pw-wdio-appium'));
