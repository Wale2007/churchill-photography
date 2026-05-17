import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const inputPath = path.join(rootDir, 'public', 'logo.PNG');
const outputPath = path.join(rootDir, 'app', 'icon.png');

await sharp(inputPath)
  .negate({ alpha: false }) // Invert colors but keep transparency
  .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(outputPath);

console.log('✅ Inverted logo saved to app/icon.png');
