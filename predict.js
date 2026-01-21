const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

async function predict() {
    // 1. Load the brain we saved earlier
    const modelPath = `file://${path.join(__dirname, 'my-model', 'model.json')}`; 
    const model = await tf.loadLayersModel(modelPath);
    console.log("🧠 Model loaded successfully!");

    // 2. Point to the NEW image you want to check
    // Replace 'test-chart.png' with a real file in your folder
    const imagePath = './cnn/test/noise1.png'; 
    
    
    if (!fs.existsSync(imagePath)) {
        console.log("❌ Error: I can't find the image to test!");
        return;
    }

    // 3. Prepare the image (The Puppy needs his glasses!)
    const buffer = fs.readFileSync(imagePath);
    let tensor = tf.node.decodeImage(buffer, 1)
        .resizeNearestNeighbor([200, 200])
        .toFloat()
        .div(tf.scalar(255))
        .mul(tf.scalar(-1)) // <--- STEP 1: Flip colors
        .add(tf.scalar(1))  // <--- STEP 2: Shift back to 0-1 range
        .expandDims(0);
    
    // Keep your debug log to verify:
    const meanValue = tensor.mean().dataSync()[0];
    console.log(`New Average Brightness: ${meanValue.toFixed(4)}`);

    if (meanValue > 0.5) {
        console.log("⚠️ The background is still WHITE. Did you forget the inversion line?");
    } else {
        console.log("✅ The background is BLACK. The AI should be able to see the line.");
    }


    // DEBUG: Print the shape and a few pixel values
    console.log("Tensor Shape:", tensor.shape); 
    const minMax = {
        min: tensor.min().dataSync()[0],
        max: tensor.max().dataSync()[0]
    };
    console.log("Pixel Range:", minMax);

    if (minMax.max > 1.0) {
        console.log("❌ ERROR: Your image isn't normalized! (It's 0-255 instead of 0-1)");
    }

    // 4. Make the Prediction
    const prediction = model.predict(tensor);
    const score = prediction.dataSync()[0]; // Get the number out of the tensor

    // 5. Tell us the result
    console.log(`-----------------------------------`);
    console.log(`📊 Analysis for: ${path.basename(imagePath)}`);
    console.log(`Confidence Score: ${(score * 100).toFixed(2)}%`);

    if (score > 0.8) {
        console.log("✅ RESULT: STRONG SIGNAL (Correct Pattern)");
    } else if (score > 0.5) {
        console.log("⚠️ RESULT: WEAK SIGNAL (Possible Pattern)");
    } else {
        console.log("❌ RESULT: NOISE (Ignore this chart)");
    }
    console.log(`-----------------------------------`);
}

predict();