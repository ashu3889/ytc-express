const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

const DATA_PATH = './cnn/train_new';
const IMAGE_SIZE = 200;
const CATEGORIES = ['noise', 'strong_down', 'week_down'];

// Versioning
const VERSION = 'v2_balanced';
const SAVE_DIR = `./models/model_${VERSION}`;

async function train() {
    console.log(`🏗️  Architecting Model ${VERSION}...`);
    
    let rawImages = [];
    let rawLabels = [];

    // 1. Get counts for balancing
    const counts = CATEGORIES.map(cat => {
        const dir = path.join(DATA_PATH, cat);
        return fs.existsSync(dir) ? fs.readdirSync(dir).length : 0;
    });
    
    const signalCount = counts[1] + counts[2];
    const noiseLimit = Math.max(signalCount * 2, 200); 

    for (let i = 0; i < CATEGORIES.length; i++) {
        const dir = path.join(DATA_PATH, CATEGORIES[i]);
        if (!fs.existsSync(dir)) continue;

        let files = fs.readdirSync(dir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
        if (CATEGORIES[i] === 'noise' && files.length > noiseLimit) files = files.slice(0, noiseLimit);

        files.forEach(file => {
            const buffer = fs.readFileSync(path.join(dir, file));
            tf.tidy(() => {
                const decode = tf.node.decodeImage(buffer, 3).resizeNearestNeighbor([IMAGE_SIZE, IMAGE_SIZE]).toFloat();
                
                const standardize = (t) => {
                    const { mean, variance } = tf.moments(t);
                    return t.sub(mean).div(tf.sqrt(variance).add(1e-5));
                };

                rawImages.push(tf.keep(standardize(decode)));
                rawLabels.push(i);

                // Augment signals only
                if (CATEGORIES[i] !== 'noise') {
                    const shiftL = decode.slice([0, 10, 0], [200, 190, 3]).resizeBilinear([200, 200]);
                    rawImages.push(tf.keep(standardize(shiftL)));
                    rawLabels.push(i);
                }
            });
        });
    }

    // 2. Manual Shuffle
    console.log("🎲 Mixing the data salad...");
    const indices = Array.from(Array(rawImages.length).keys());
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const shuffledXs = tf.tidy(() => tf.stack(indices.map(idx => rawImages[idx])));
    const shuffledYs = tf.tidy(() => tf.oneHot(tf.tensor1d(indices.map(idx => rawLabels[idx]), 'int32'), CATEGORIES.length));

    // Cleanup individual tensors
    rawImages.forEach(t => t.dispose());

    // 3. Build Model
    const model = tf.sequential();
    model.add(tf.layers.conv2d({ inputShape: [200, 200, 3], filters: 16, kernelSize: 5, activation: 'relu' }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    model.add(tf.layers.conv2d({ filters: 32, kernelSize: 3, activation: 'relu' }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.6 })); 
    model.add(tf.layers.dense({ units: CATEGORIES.length, activation: 'softmax' }));

    const optimizer = tf.train.adam(0.0001); 

    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });
    
    console.log(`🚀 Re-calibrating Model on ${shuffledXs.shape[0]} images...`);
    
    await model.fit(shuffledXs, shuffledYs, {
        epochs: 50,           // 50 is the "sweet spot" for this data size
        validationSplit: 0.2,
        shuffle: true,
        // REFINED WEIGHTS: High enough to find curves, low enough to respect "Noise"
        classWeight: { 
            0: 1.0,  // Noise (The anchor)
            1: 3.5,  // Strong Down
            2: 5.0   // Week Down (Strong priority, but not a 'bully')
        },
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch+1}: Acc: ${logs.acc.toFixed(3)} | ValAcc: ${logs.val_acc.toFixed(3)}`);
            }
        }
    });
    if (!fs.existsSync('./models')) fs.mkdirSync('./models');
    await model.save(`file://${SAVE_DIR}`);
    console.log(`✅ Done! Model saved in ${SAVE_DIR}`);
}

train().catch(err => console.error(err));