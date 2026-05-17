const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'public', 'logo.PNG');
const outputPath = path.join(__dirname, '..', 'app', 'icon.png');

sharp(inputPath)
  .negate({ alpha: false })
  .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(outputPath)
  .then(() => console.log('Inverted logo saved to app/icon.png'))
  .catch(err => console.error('Error:', err));
