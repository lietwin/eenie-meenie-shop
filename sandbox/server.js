const express = require('express');

module.exports = () => {
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello, Meanote!');
  });

  app.get('/user/:user', (req, res) => {
    res.send(`Page for user ${req.params.user} with option ${req.query.option}`);
  });

  return app;
};
