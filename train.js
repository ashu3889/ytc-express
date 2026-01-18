const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

// Define your required folders
const folders = [
    path.join(__dirname, 'cnn', 'train', 'weakness'),
    path.join(__dirname, 'cnn', 'train', 'noise')
];

// Create them if they don't exist
folders.forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
        console.log(`✅ Created directory: ${folder}`);
    }
});

async function loadData(folder, label) {
    const files = fs.readdirSync(folder);
    return files.map(file => {
        const buffer = fs.readFileSync(path.join(folder, file));
        return {
            image: tf.node.decodeImage(buffer, 1) // Greyscale
                .resizeBilinear([200, 200])
                .div(255.0),
            label: label
        };
    });
}

async function train() {
    const model = tf.sequential();
    // Sandwich 1
    model.add(tf.layers.conv2d({inputShape: [200, 200, 1], kernelSize: 3, filters: 16, activation: 'relu'}));
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
    // Sandwich 2
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu'}));
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
    
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 64, activation: 'relu'}));
    model.add(tf.layers.dense({units: 1, activation: 'sigmoid'})); // Output: 0 to 1

    model.compile({optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy']});

    console.log("Loading images...");
    const weakness = await loadData('./cnn/train/weakness', 1);
    const noise = await loadData('./cnn/train/noise', 0);
    const allData = [...weakness, ...noise];
    
    const xs = tf.stack(allData.map(d => d.image));
    const ys = tf.tensor2d(allData.map(d => [d.label]));

    console.log("Training started...");
    await model.fit(xs, ys, {epochs: 20, shuffle: true});
    
    await model.save('file://./my-model');
    console.log("Model saved to ./my-model");
}

train();