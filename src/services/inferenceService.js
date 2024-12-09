const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, image) {
  try {
    
    const tensor = tf.node
      .decodeJpeg(image)
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

    console.log('confidenceScore:', confidenceScore);
    console.log('label:', label);
    console.log('suggestion:', suggestion);

    return { label, suggestion };
  } catch (error) {
    console.error('Error during prediction:', error);
    res.status(500).json({ message: 'Error during prediction' });
  }
}

module.exports = { predictClassification };