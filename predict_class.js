const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

// ==========================================
// CONFIGURATION
// ==========================================
// 1. Point this to the specific image you want to test
const IMAGE_TO_PREDICT = './cnn/test/white.png'; 

// 2. Ensure this path points to your model folder
const MODEL_PATH = 'file://./my-model/model.json';

// 3. Must match your training categories exactly
const CATEGORIES = ['noise', 'strong_trend', 'weak_trend'];

// 4. Probability threshold (0.90 = 90%)
const CONFIDENCE_THRESHOLD = 0.90; 
// ==========================================

async function runPrediction() {
    try {
        // Check if file exists
        if (!fs.existsSync(IMAGE_TO_PREDICT)) {
            console.error(`❌ Error: Image not found at ${path.resolve(IMAGE_TO_PREDICT)}`);
            return;
        }

        console.log("📂 Loading model...");
        const model = await tf.loadLayersModel(MODEL_PATH);

        console.log("🖼️  Processing image...");
        const imageBuffer = fs.readFileSync(IMAGE_TO_PREDICT);

        // --- FIXING THE SHAPE MISMATCH ---
        // decodeImage(buffer, 1) forces the image to 1 channel (Grayscale)
        // resizeNearestNeighbor([200, 200]) ensures the exact dimensions your model expects
        const tensor = tf.node.decodeImage(imageBuffer, 1) 
            .resizeNearestNeighbor([200, 200]) 
            .expandDims(0)
            .toFloat()
            .div(255.0);

        console.log("🧠 AI is thinking...");
        const prediction = model.predict(tensor);
        const probabilities = await prediction.data();
        const maxIndex = prediction.argMax(1).dataSync()[0];
        const confidence = probabilities[maxIndex];

        // --- RESULTS ---
        console.log(`\n` + "=".repeat(40));
        console.log(`FILE: ${path.basename(IMAGE_TO_PREDICT)}`);
        
        if (confidence < CONFIDENCE_THRESHOLD) {
            console.log(`⚠️  RESULT: UNSURE (Only ${(confidence * 100).toFixed(2)}% confident)`);
            console.log(`👉 ADVICE: Pattern is too close to "Noise". Do not trade.`);
        } else {
            console.log(`🏆 RESULT: ${CATEGORIES[maxIndex].toUpperCase()}`);
            console.log(`📈 CONFIDENCE: ${(confidence * 100).toFixed(2)}%`);
        }
        console.log("=".repeat(40) + `\n`);

        // Memory Cleanup
        tensor.dispose();
        prediction.dispose();

    } catch (err) {
        console.error("❌ CRITICAL ERROR:", err.message);
    }
}

runPrediction();