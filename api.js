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

  api.get('/product/category/:id', wagner.invoke((Product) =>
    (req, res) => {
      const sort = { name: 1 };
      if (req.query.price === '1') {
        sort = { 'internal.approximatePriceUSD': 1 };
      } else if (req.query.price === '-1') {
        sort = { 'internal.approximatePriceUSD': -1 };
      }

      Product
        .find({ 'category.ancestors': req.params.id })
        .sort(sort)
        .exec(handleMany.bind(null, 'products', res));
    }
  ));

  // return the router to be used
  return api;
};

function handleOne(property, res, error, result) {
  if (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }

  if (!result) {
    return res
      .status(status.NOT_FOUND)
      .json({ error: 'Not found' });
  }

  const json = {};
  json[property] = result;
  res.json(json);
}

function handleMany(property, res, error, result) {
  if (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }

  const json = {};
  json[property] = result;
  res.json(json);
}
