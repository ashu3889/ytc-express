const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// --- CONFIGURATION ---
const IMAGE_TO_SEE = './cnn/test/valid.png'; // The chart you want to "see" through AI eyes
const MODEL_DIR = './my-model';
const OUTPUT_NAME = 'ai_vision.png';

async function visualize() {
    try {
        console.log(`🧠 Loading model and analyzing: ${IMAGE_TO_SEE}...`);

        // 1. Load the model
        const model = await tf.loadLayersModel(`file://${path.join(__dirname, MODEL_DIR, 'model.json')}`);
        
        // 2. Process the image (Mirroring your training logic)
        const buffer = fs.readFileSync(IMAGE_TO_SEE);
        const input = tf.node.decodeImage(buffer, 1)
            .resizeNearestNeighbor([200, 200])
            .toFloat()
            .div(tf.scalar(255))
            .mul(tf.scalar(-1)).add(tf.scalar(1)) // Inversion
            .expandDims(0);

        // 3. Create a Sub-Model to "stop" at the first Convolution layer
        // Note: 'conv2d_Conv2D1' is standard, but if it fails, check model.summary()
        const layer1 = model.getLayer(model.layers[0].name); 
        const visualModel = tf.model({inputs: model.inputs, outputs: layer1.output});

        // 4. Run the prediction through just that one layer
        const featureMaps = visualModel.predict(input);
        
        // 5. Extract the 3rd filter (index 2) and scale for human eyes
        const filterView = tf.tidy(() => {
            // Squeeze removes the [1, height, width, 1] extra dimensions
            const raw = featureMaps.slice([0, 0, 0, 2], [1, -1, -1, 1]).squeeze();
            // Scale values from 0.0-1.0 back to 0-255
            return raw.mul(tf.scalar(255)).cast('int32');
        });

        const [height, width] = filterView.shape;
        const data = await filterView.data();

        // 6. Draw the data to a Canvas
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const imgData = ctx.createImageData(width, height);

        for (let i = 0; i < data.length; i++) {
            const val = data[i];
            const j = i * 4;
            imgData.data[j] = val;     // R
            imgData.data[j + 1] = val; // G
            imgData.data[j + 2] = val; // B
            imgData.data[j + 3] = 255; // Alpha (Opacity)
        }

        ctx.putImageData(imgData, 0, 0);

        // 7. Write file to disk
        const out = fs.createWriteStream(path.join(__dirname, OUTPUT_NAME));
        const stream = canvas.createPNGStream();
        stream.pipe(out);

        out.on('finish', () => {
            console.log('-----------------------------------');
            console.log(`✅ SUCCESS! File saved as: ${OUTPUT_NAME}`);
            console.log(`📏 Dimensions: ${width}x${height}`);
            console.log('-----------------------------------');
        });

    } catch (error) {
        console.error("❌ Visualization Error:", error.message);
    }
}

// --- INITIALIZE CALL ---
visualize();