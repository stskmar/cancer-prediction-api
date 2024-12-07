require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');
const cors = require('cors');
const bodyParser = require('body-parser');

(async () => {
  const app = express();
  const model = await loadModel();
  app.locals.model = model; // Menyimpan model dalam locals app

  app.use(cors()); // Mengizinkan semua domain untuk akses
  app.use(bodyParser.json()); // Parsing JSON request body
  app.use(bodyParser.urlencoded({ extended: true })); // Untuk form-data (multipart)

  // Memasukkan routes ke Express
  routes(app);

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
