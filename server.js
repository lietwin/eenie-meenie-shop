const express = require('express');

module.exports = () => {
  const app = express();

  app.get('/', function(req, res){
    res.send('Hello, Meanote!');
  });

  app.get('/user/:user', function(req, res){
    res.send('Page for user '+ req.params.user + ' with option ' + req.query.option);
  });

return app;
};
