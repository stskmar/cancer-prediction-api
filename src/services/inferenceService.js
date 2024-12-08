const tf = require('@tensorflow/tfjs-node');

async function predictClassification(req, res) {
  try {
    const model = await loadModel(); // Load the model here
    const imageBuffer = req.file.buffer; // Get the image buffer from the request

    // Check if the imageBuffer is a valid Buffer object
    if (!Buffer.isBuffer(imageBuffer)) {
      throw new Error('Invalid image buffer');
    }

    const tensor = tf.node
      .decodePng(imageBuffer)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const label = confidenceScore <= 50 ? 'Non-cancer' : 'Cancer';
    let suggestion;

    if (label === 'Cancer') {
      suggestion = "Segera periksa ke dokter!";
    }

    if (label === 'Non-cancer') {
      suggestion = "Anda sehat!";
    }

    res.json({ label, suggestion });
  } catch (error) {
    console.error('Error during prediction:', error);
    res.status(500).json({ message: 'Error during prediction' });
  }
}

module.exports = predictClassification;