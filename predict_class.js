const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

async function predict(imagePath) {
    const model = await tf.loadLayersModel('file://./models/model_v2_balanced/model.json');
    const CATEGORIES = ['noise', 'strong_down', 'week_down'];

    const buffer = fs.readFileSync(imagePath);
    const tensor = tf.node.decodeImage(buffer, 3)
        .resizeNearestNeighbor([200, 200])
        .toFloat();

    // MUST match the training standardization exactly!
    const standardized = tf.tidy(() => {
        const { mean, variance } = tf.moments(tensor);
        return tensor.sub(mean).div(tf.sqrt(variance).add(1e-5));
    });

    const prediction = model.predict(standardized.expandDims(0));
    const data = await prediction.data();
    
    console.log("\n--- Prediction Results ---");
    CATEGORIES.forEach((cat, i) => {
        console.log(`${cat}: ${(data[i] * 100).toFixed(2)}%`);
    });

    const winningIndex = data.indexOf(Math.max(...data));
    console.log(`\n🏆 RESULT: ${CATEGORIES[winningIndex]}`);
}

// Pass your test image path here
predict('./cnn/test/valid123.png');