const fs = require('fs');
const path = require('path');

function createDirAndCopyFile() {
  const srcDir = path.join(__dirname, 'src', 'generated');
  const configFile = path.join(__dirname, '..', 'config.json');

  // Create directory if it doesn't exist
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }

  // Copy file
  try {
    const destFile = path.join(srcDir, 'config.json');
    fs.copyFileSync(configFile, destFile);
    console.info(`Copied ${configFile} to ${destFile}`);
  } catch (error) {
    console.error(`Error copying file: ${error.message}`);
  }
}

createDirAndCopyFile();
