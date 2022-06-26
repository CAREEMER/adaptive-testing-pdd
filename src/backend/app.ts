const _express = require('express');

const api = require('./api');

const app = _express();

app.use(_express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
  });
});

app.use('/api/v1', api);

module.exports = app;