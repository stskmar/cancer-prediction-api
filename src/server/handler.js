const { predictClassification } = require('../services/inferenceService.js');
const crypto = require('crypto');
const storeData = require('../services/storeData.js');
const getAllData = require('../services/getAllData.js');

async function postPredictHandler(req, res) {
  const image = req.file.buffer;
  const model = req.app.locals.model;
  
  if (!image) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  if (image.length > 1000000) {
    return res.status(413).json({
      status: 'fail',
      message: 'Payload content length greater than maximum allowed: 1000000',
    });
  }


  try {
    const { result, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = { 
      id,
      result, 
      suggestion, 
      createdAt,
    };

    await storeData(id, data);

    res.status(201).json({
      status: 'success',
      message: 'Model is predicted successfully',
      data,
    });
  } catch (error) {
    console.error('Error during prediction:', error);
    return res.status(400).json({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi',
    });
  }
}

async function getPredictHistoriesHandler(req, res) {
  const allData = await getAllData();

  const formatAllData = allData.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      history: {
        result: data.label,
        createdAt: data.createdAt,
        suggestion: data.suggestion,
        id: doc.id,
      },
    };
  });

  res.status(200).json({
    status: 'success',
    data: formatAllData,
  });
}


module.exports = { postPredictHandler, getPredictHistoriesHandler };
