const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer();

const { postPredictHandler, getPredictHistoriesHandler } = require('./handler.js');

router.post('/predict', upload.single('image'), (req, res) => {
  postPredictHandler(req, res);
});

router.post('/predict/histories', (req, res) => {
  getPredictHistoriesHandler(req, res);
});

module.exports = router;
