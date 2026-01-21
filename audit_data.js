const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Paths to your folders
const trainDir = './cnn/train';
const valDir = './cnn/val';

function getFileHashes(directory) {
    const hashes = new Map();
    const categories = fs.readdirSync(directory);

    categories.forEach(category => {
        const catPath = path.join(directory, category);
        if (fs.lstatSync(catPath).isDirectory()) {
            const files = fs.readdirSync(catPath);
            files.forEach(file => {
                const filePath = path.join(catPath, file);
                const fileBuffer = fs.readFileSync(filePath);
                const hash = crypto.createHash('md5').update(fileBuffer).digest('hex');
                hashes.set(hash, `${category}/${file}`);
            });
        }
    });
    return hashes;
}

console.log("🔍 Auditing dataset for leaks...");
const trainHashes = getFileHashes(trainDir);
const valHashes = getFileHashes(valDir);

let duplicates = 0;
valHashes.forEach((name, hash) => {
    if (trainHashes.has(hash)) {
        console.log(`⚠️ LEAK DETECTED: "${name}" in Validation is identical to "${trainHashes.get(hash)}" in Training.`);
        duplicates++;
    }
});

if (duplicates === 0) {
    console.log("✅ No leaks found! Your 100% accuracy is likely due to the patterns being very distinct.");
} else {
    console.log(`❌ Found ${duplicates} duplicate images. Remove these from Validation to get an honest score.`);
}

console.log(`\n📊 Dataset Stats:`);
console.log(`Training Images: ${trainHashes.size}`);
console.log(`Validation Images: ${valHashes.size}`);