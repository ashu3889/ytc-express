const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const NOISE_DIR = './cnn/train_new/noise';
const IMAGE_SIZE = 200;

// Ensure directory exists
if (!fs.existsSync(NOISE_DIR)) fs.mkdirSync(NOISE_DIR, { recursive: true });

function generateBlankImages() {
    console.log("🎨 Generating 'Nothingness' images for training...");

    for (let i = 0; i < 50; i++) {
        const canvas = createCanvas(IMAGE_SIZE, IMAGE_SIZE);
        const ctx = canvas.getContext('2d');

        if (i < 20) {
            // 1. Pure Black (The "Monitor Off" test)
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
        } else if (i < 30) {
            // 2. Pure White
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
        } else {
            // 3. Random Static (Salt and Pepper)
            const imageData = ctx.createImageData(IMAGE_SIZE, IMAGE_SIZE);
            for (let j = 0; j < imageData.data.length; j += 4) {
                const val = Math.random() * 255;
                imageData.data[j] = val;     // R
                imageData.data[j + 1] = val; // G
                imageData.data[j + 2] = val; // B
                imageData.data[j + 3] = 255; // Alpha
            }
            ctx.putImageData(imageData, 0, 0);
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(path.join(NOISE_DIR, `blank_noise_${i}.png`), buffer);
    }
    console.log("✅ 50 Blank/Static images added to /noise folder.");
}

generateBlankImages();