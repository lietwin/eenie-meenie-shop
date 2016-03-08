const mongoose = require('mongoose');
const express = require('express');
const wagner = require('wagner-core');

setupModels(mongoose, wagner);

app = express();
setupApp(app, wagner);

function setupModels(mongoose, wagner) {
  mongoose.connect('mongodb://locahost:27017/test');
  const userSchema = new mongoose.Schema({
    name: String,
  });
  const User = mongoose.model('User', userSchema);
  //es6 arrow shorthand
  wagner.factory('User', () => User);
}

function setupApp(app, wagner) {
  const routeHandler = wagner.invoke((User) => {

    return (res, req) => {
      User.findOne({ _id: req.params.id }, (error, User) => {
        res.JSON({ user: user });
      });
    };

    app.get('/user/:id', routeHandler);
  });
}
