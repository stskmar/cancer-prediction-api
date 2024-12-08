const tf = require('@tensorflow/tfjs-node');

function loadModel() {
  const modelUrl = process.env.MODEL_URL;
  if (modelUrl) {
    console.log('Model berhasil dimuat');
    return tf.loadGraphModel(modelUrl);
  } else {
    console.error('Model gagal dimuat!');
  }
}

async function predictClassification(model, image, res) {
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

    return { label, suggestion };
  } catch (error) {
    console.error('Error during prediction:', error);
    res.status(500).json({ message: 'Error during prediction' });
  }
}

module.exports = { predictClassification, loadModel };