const { postPredictHandler, getPredictHistoriesHandler } = require('./handler.js');

const routes = (app, upload, model) => {
  app.post('/predict', upload.single('image'), (req, res) => {
    postPredictHandler(req, res, model);
  });
  app.get('/predict/histories', getPredictHistoriesHandler);
  
};

module.exports = routes;
