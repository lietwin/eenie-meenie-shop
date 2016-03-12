const wagner = require('wagner-core');
const express = require('express');
const status = require('http-status');

const models = require('./models');

module.exports = (wagner) => {
  const api = express.Router();

  // Home say hello
  api.get('/', (req, res) => {
    res.send('Hello Warrior, welcome to the Meanotte Land');
  });

  // the Category API
  // Get a category by id
  api.get('/category/id/:id', wagner.invoke((Category) =>
    (req, res) => {
      Category.findOne({ _id: req.params.id }, (error, category) => {
        if (error) {
          return res
          .status(status.INTERNAL_SERVER_ERROR)
          .json({ error: error.toString() });
        }

        if (!category) {
          return res
          .status(status.NOTFOUND)
          .json({ error: 'Not found' });
        }

        res.json({ category: category });
      });
    }
  ));

  // Get children categories by parent
  api.get('/category/parent/:id', wagner.invoke((Category) =>
    (req, res) => {
      Category
      .find({ parent: req.params.id })
      .sort({ _id: 1 })
      .exec((error, categories) => {
        if (error) {
          return res
          .status(status.INTERNAL_SERVER_ERROR)
          .json({ error: error.toString() });
        }

        res.json({ categories: categories });
      });
    }
  ));

  // The Product api

  // Get the product by id
  api.get('/product/id/:id', wagner.invoke((Product) =>
    (req, res) => {
      Product.findOne({ _id: req.params.id }, (error, product) => {
        if (error) {
          return res
          .status(status.INTERNAL_SERVER_ERROR)
          .json({ error: error.toString() });
        }

        if (!product) {
          return res
          .status(status.NOTFOUND)
          .json({ error: 'Not found' });
        }

        res.json({ product: product });
      });

    }
  ));

  // The User api

  api.get('/user/id/:id', wagner.invoke((User) =>
    (req, res) => {
      User.findOne({ _id: req.params.id }, (error, user) => {
        if (error) {
          return res
          .status(status.INTERNAL_SERVER_ERROR)
          .json({ error: error.toString() });
        }

        if (!user) {
          return res
          .status(status.NOTFOUND)
          .json({ error: 'Not found' });
        }

        return res.json({ user: user });

      });
    }
  ));

  // return the router to be used
  return api;
};
