const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const getAllData = require('../services/getAllData');

async function postPredictHandler(req, res) {
  const { image } = req.body;
  const { model } = req.app;

  const { label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id,
    result: label,
    suggestion,
    createdAt,
  };

  await storeData(id, data);

  res.status(201).json({
    status: 'success',
    message: 'Model is predicted successfully',
    data,
  });
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
