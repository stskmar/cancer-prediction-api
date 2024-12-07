const tf = require('@tensorflow/tfjs-node');
const path = require('path');

async function loadModel() {
  try {
    // Tentukan path model lokal
    const modelPath = path.join(__dirname, '../../model/model.json'); // Sesuaikan path jika perlu

    // Memuat model dari file lokal
    const model = await tf.loadGraphModel(`file://${modelPath}`);
    if (model) {
      console.log('Model berhasil dimuat');
    } else {
      console.error('Model gagal dimuat!');
    }
    return model;
  } catch (error) {
    console.error('Gagal memuat model:', error);
    return null; // Kembalikan null jika gagal memuat model
  }
}

module.exports = loadModel;
