const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

async function train() {
    // // 1. Define the Brain (Model Architecture)
    // const model = tf.sequential();

    // // Layer 1: Convolutional layer to find edges/lines
    // model.add(tf.layers.conv2d({
    //     inputShape: [200, 200, 1],
    //     filters: 8,           // Small number of filters to prevent memorizing noise
    //     kernelSize: 3,
    //     activation: 'relu'
    // }));
    // model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));

    // // Flatten for the dense layers
    // model.add(tf.layers.flatten());

    // // Layer 2: DROPOUT - Randomly ignores 50% of neurons during training 
    // // This stops the AI from memorizing specific pixel locations.
    // model.add(tf.layers.dropout({ rate: 0.5 })); 

    // model.add(tf.layers.dense({units: 32, activation: 'relu'}));
    
    // // Output Layer: Sigmoid gives a score between 0 and 1
    // model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));

    // 2. Setup Optimizer with a SLOW Learning Rate
    // 0.0001 prevents the model from "jumping" and losing focus

    const model = tf.sequential();

    // Layer 1: Just 4 filters! This forces it to see ONLY the biggest lines.
    model.add(tf.layers.conv2d({
        inputShape: [200, 200, 1],
        filters: 4, 
        kernelSize: 5, // Larger kernel to see bigger chunks of the line
        activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({poolSize: [4, 4]})); // Aggressive pooling to blur details
    
    model.add(tf.layers.flatten());
    
    // Aggressive Dropout: Ignore 70% of the brain during training
    model.add(tf.layers.dropout({ rate: 0.7 })); 
    
    model.add(tf.layers.dense({units: 8, activation: 'relu'})); // Very few units
    model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));
    const optimizer = tf.train.adam(0.0001);

    model.compile({
        optimizer: optimizer,
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
    });

    // 3. Image Loading Function with INVERSION
    const loadImagesFromDir = (dir) => {
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
        let tensors = [];

        files.forEach(file => {
            const buffer = fs.readFileSync(path.join(dir, file));
            
            // Process the original image
            const rawImg = tf.node.decodeImage(buffer, 1)
                .resizeNearestNeighbor([200, 200])
                .toFloat()
                .div(tf.scalar(255))
                .mul(tf.scalar(-1)).add(tf.scalar(1)); // Flip: White -> Black

            tensors.push(rawImg);

            // --- DATA AUGMENTATION ---
            // Create a slightly "zoomed" version to stop the AI from memorizing
            const augmented = tf.image.cropAndResize(
                rawImg.expandDims(0),      // Make it 4D for the tool
                [[0.05, 0.05, 0.95, 0.95]], // Zoom in 5%
                [0], 
                [200, 200]
            ).squeeze(0);                  // Back to 3D [200, 200, 1]
            
            tensors.push(augmented);
        });
        return tensors;
    };
    console.log("📂 Loading and inverting images...");
    const correctImages = loadImagesFromDir('./cnn/train/correct');
    const noiseImages = loadImagesFromDir('./cnn/train/noise');

    if (correctImages.length === 0 || noiseImages.length === 0) {
        throw new Error("No images found! Check your folder paths.");
    }

    // 4. Stack the images into a 4D Tensor [BatchSize, 200, 200, 1]
    const xs = tf.stack([...correctImages, ...noiseImages]);
    
    // Create Labels: 1 for Correct, 0 for Noise
    const ys = tf.tensor2d(
        [...correctImages.map(() => 1), ...noiseImages.map(() => 0)],
        [correctImages.length + noiseImages.length, 1]
    );

    console.log(`🚀 Training on ${xs.shape[0]} images...`);

    // 5. Run the Training
    await model.fit(xs, ys, {
        epochs: 40,        // More epochs because the learning rate is slower
        shuffle: true,
        validationSplit: 0.2, // Keeps 20% aside to test "new" data
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)} | acc = ${logs.acc.toFixed(3)} | val_acc = ${logs.val_acc.toFixed(3)}`);
            }
        }
    });

    // 6. Save the Brain
    const savePath = './my-model';
    if (!fs.existsSync(savePath)) fs.mkdirSync(savePath);
    
    await model.save(`file://${path.join(__dirname, 'my-model')}`);
    console.log("✅ Training Complete. Model saved to ./my-model");

    // Clean up memory
    xs.dispose();
    ys.dispose();
}

train().catch(err => console.error(err));