require('dotenv').config();
const express = require('express');
const multer = require('multer');
const routes = require('./routes.js');
const loadModel = require('../services/loadModel.js');
const InputError = require('../exceptions/InputError.js');
const cors = require('cors');
const bodyParser = require('body-parser');

// Multer configuration
const upload = multer(); // Default file upload configuration

(async () => {
  const app = express();
  const model = await loadModel();
  app.locals.model = model; // Menyimpan model dalam locals app

  app.use(cors()); // Mengizinkan semua domain untuk akses
  app.use(bodyParser.json()); // Parsing JSON request body
  app.use(bodyParser.urlencoded({ extended: true })); // Untuk form-data (multipart)

  // Memasukkan routes ke Express, menggunakan Multer untuk menangani form-data
  routes(app, upload);

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
