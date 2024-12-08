const { predictClassification } = require('../services/inferenceService.js');
const crypto = require('crypto');
const storeData = require('../services/storeData.js');
const getAllData = require('../services/getAllData.js');

async function postPredictHandler(req, res, model) {
  const image = req.file.buffer;
  if (!image) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  try {
    const { label, suggestion } = await predictClassification(model, image, res);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id,
      result: label,
      suggestion,
      createdAt,
    };

    // await storeData(id, data);

    res.status(201).json({
      status: 'success',
      message: 'Model is predicted successfully',
      data,
    });
  } catch (error) {
    console.error('Error during prediction:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
}

async function postPredictHistoriesHandler(req, res) {
  const allData = await getAllData();

  const formatAllData = allData.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      history: {
        result: data.result,
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

module.exports = { postPredictHandler, postPredictHistoriesHandler };