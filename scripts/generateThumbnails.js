const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, '../public/images');
const targetDir = path.join(__dirname, '../public/images/thumbnails');
const THUMB_SIZE = 400;

async function processImage(sourcePath, targetPath) {
  try {
      await fs.ensureDir(path.dirname(targetPath));
      
      if (path.extname(sourcePath).toLowerCase() === '.mp4') {
          await fs.copy(sourcePath, targetPath);
          return;
      }

      await sharp(sourcePath)
          .resize({
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              fit: 'inside',      // This maintains aspect ratio
              withoutEnlargement: true
          })
          .toFile(targetPath);

      console.log(`✓ Created thumbnail: ${path.basename(targetPath)}`);
  } catch (error) {
      console.error(`✗ Error processing ${sourcePath}:`, error);
  }
}

async function processDirectory(dirPath) {
    const collections = ['tokyo', 'kyoto', 'takayama', 'kanazawa', 'nara', 'osaka', 'shirakawago', 'thailandia'];
    
    for (const collection of collections) {
        const collectionPath = path.join(dirPath, collection);
        const targetCollectionPath = path.join(targetDir, collection);
        
        try {
            const files = await fs.readdir(collectionPath);
            
            for (const file of files) {
                const sourcePath = path.join(collectionPath, file);
                const targetPath = path.join(targetCollectionPath, file);
                
                await processImage(sourcePath, targetPath);
            }
        } catch (error) {
            console.error(`Error processing collection ${collection}:`, error);
        }
    }
}

// Start processing
console.log('Starting thumbnail generation...');
processDirectory(sourceDir)
    .then(() => console.log('Thumbnail generation complete!'))
    .catch(console.error);