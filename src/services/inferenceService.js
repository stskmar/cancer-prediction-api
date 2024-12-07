const tf = require('@tensorflow/tfjs-node');

async function predictClassification(image) {
  try {

    const tensor = tf.node
      .decodePng(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat()

    // Pastikan tensor tidak undefined
    if (!tensor) {
      throw new Error('Tensor tidak dapat dibuat dari gambar.');
    }

    // Melakukan prediksi dengan model
    const prediction = model.predict(tensor);

    // Pastikan hasil prediksi ada
    if (!prediction) {
      throw new Error('Prediksi tidak berhasil.');
    }

    // Menangani data prediksi
    const score = await prediction.data();  // Mengambil data dari tensor
    if (score && score.length > 0) {
      const confidenceScore = Math.max(...score) * 100;  // Mengambil skor tertinggi
    }

    const confidenceScore = Math.max(...score) * 100;

    const label = confidenceScore <= 50 ? 'Non-cancer' : 'Cancer';
    let suggestion;

    if (label === 'Cancer') {
      suggestion = "Segera periksa ke dokter!";
    } else {
      suggestion = "Anda sehat!";
    }

    return { label, suggestion };
  } catch (error) {
    console.error('Error in prediction:', error);
    throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
  }
}

module.exports = predictClassification;
