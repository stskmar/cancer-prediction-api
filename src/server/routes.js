const { postPredictHandler, postPredictHistoriesHandler } = require('./handler');

const routes = (app) => {
  app.post('/predict', postPredictHandler);
  app.get('/predict/histories', postPredictHistoriesHandler);
};

module.exports = routes;
