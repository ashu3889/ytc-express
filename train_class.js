const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const DATA_PATH = './cnn/train';
const MODEL_SAVE_PATH = 'file://./my-model';
const IMAGE_SIZE = 200;
const EPOCHS = 50;
const BATCH_SIZE = 32;
const CATEGORIES = ['noise', 'strong_down', 'weak_down'];

async function train() {
    console.log("🚀 Starting Robust Training...");
    
    const images = [];
    const labels = [];

    // 1. Load and Augment Data
    for (let i = 0; i < CATEGORIES.length; i++) {
        const dir = path.join(DATA_PATH, CATEGORIES[i]);
        const files = fs.readdirSync(dir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
        
        console.log(`📂 Loading ${files.length} images from ${CATEGORIES[i]}...`);

        files.forEach(file => {
            const buffer = fs.readFileSync(path.join(dir, file));
            
            // --- THE FIX: ROBUST PREPROCESSING ---
            const tensor = tf.tidy(() => {
                let img = tf.node.decodeImage(buffer, 1) // Force Grayscale
                    .resizeNearestNeighbor([IMAGE_SIZE, IMAGE_SIZE])
                    .toFloat();
            
                // --- CORRECTED STANDARDIZATION ---
                // tf.moments returns both mean and variance
                const { mean, variance } = tf.moments(img);
                const std = tf.sqrt(variance);
                
                // Subtract mean and divide by standard deviation
                // We add a tiny epsilon (1e-5) to prevent "Division by Zero" on blank images
                return img.sub(mean).div(std.add(tf.scalar(1e-5))); 
            });

            images.push(tensor);
            labels.push(i);
        });
    }

    const xs = tf.stack(images); 

    // 2. Ensure labels are a 1D tensor of integers
    const ys = tf.oneHot(tf.tensor1d(labels, 'int32'), CATEGORIES.length);
    
    console.log("✅ Data Tensor Shape:", xs.shape);

    // 2. Define Model
    const model = tf.sequential();
    model.add(tf.layers.conv2d({
        inputShape: [IMAGE_SIZE, IMAGE_SIZE, 1],
        filters: 32,
        kernelSize: 3,
        activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.5 })); // Prevents memorizing backgrounds
    model.add(tf.layers.dense({ units: CATEGORIES.length, activation: 'softmax' }));

    model.compile({
        optimizer: tf.train.adam(0.0001), // Lower learning rate for stability
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    // 3. Train
    await model.fit(xs, ys, {
        epochs: EPOCHS,
        batch_size: BATCH_SIZE,
        shuffle: true,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch + 1}: Loss = ${logs.loss.toFixed(4)}, Acc = ${logs.acc.toFixed(4)}`);
            }
        }
    });

    // 4. Save
    await model.save(MODEL_SAVE_PATH);
    console.log("✅ Model Saved! Run your prediction script now.");
}

train().catch(console.error);