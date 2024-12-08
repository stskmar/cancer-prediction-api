require('dotenv').config();
const express = require('express');
const multer = require('multer');
const routes = require('./routes.js');
const { loadModel } = require('../services/inferenceService.js');
const InputError = require('../exceptions/InputError.js');
const cors = require('cors');
const bodyParser = require('body-parser');

const upload = multer();

(async () => {
  const app = express();
  const model = await loadModel();
  app.locals.model = model;

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  routes(app, upload, model);

  // Error handler
  app.use((err, req, res, next) => {
    if (err instanceof InputError) {
      return res.status(err.statusCode).json({
        status: 'fail',
        message: err.message,
      });
    }

    if (err.isBoom) {
      return res.status(err.output.statusCode).json({
        status: 'fail',
        message: err.message,
      });
    }

    next(err);
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();
