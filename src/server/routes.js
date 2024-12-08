const { postPredictHandler, postPredictHistoriesHandler } = require('./handler.js');


const routes = (app, upload) => {
  // Menggunakan Multer untuk menangani unggahan file gambar
  app.post('/predict', upload.single('image'), (req, res) => {
    postPredictHandler(req, res);
  });
  app.get('/predict/histories', postPredictHistoriesHandler);
};

module.exports = routes;
