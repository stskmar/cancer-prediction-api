const { postPredictHandler, postPredictHistoriesHandler } = require('./handler.js');

const routes = (app, upload, model) => {
  app.post('/predict', upload.single('image'), (req, res) => {
    postPredictHandler(req, res, model);
  });
  app.get('/predict/histories', postPredictHistoriesHandler);
};

module.exports = routes;
