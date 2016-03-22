const wagner = require('wagner-core');
const bodyparser = require('bodyparser'); // to parse HTTP body
const express = require('express');
const status = require('http-status');
const _ = require('underscore');

const models = require('./models');

module.exports = (wagner) => {
  const api = express.Router();

  //init bodyparser, before any request!
  api.use(bodyparser.json())

  // Home say hello
  api.get('/', (req, res) => {
    res.send('Hello Warrior, welcome to the Meanotte Land');
  });


  api.put('/me/cart', wagner.invoke((User) => (req, res) => {
    try {
      const cart = req.body.data.cart;
    } catch (e) {
      return res
        .status(status.BAD_REQUEST)
        .json({
          error: 'No cart specified'
        });
    }
    req.user.cart = cart;
    req.user.save((error, user) => {
      f (error) {
        return res
          .status(status.INTERNAL_SERVER_ERROR)
          .json({ error: error.toString() });
      }
      return res.json({ user: user });
    });
  }));

  api.get('/me', (req, res) => {
    if (!req.user) {
      return res
              .status(status.UNAUTHORIZED)
              .json({ error: 'Not logged in' });
    }

    res.json({ user: req.user });
    );
  });

 api.post('/checkout', wagner.invoke(Stripe, () =>
    (req, res) => {
      if(!req.user){
        return res
          .status(status.UNAUTHORIZED)
          .json({ error: 'Not logged in' });
      }
      // similar to SQL join operation
      req.user.populate(
        { path: 'data.cart.product', model: 'Product'}, (error, user) =>{
          // Sum up the total of the car
          let totalCostUSD = 0
          _each(user.data.cart, (item) => {
            totalCostUSD += item.product.internal.approximatePriceUSD * item.quantity;
          });

          /*
          for(item of user.data.cart){
          totalCostUSD += item.product.internal.approximatePriceUSD * item.quantity;
         }
          */

          // Charge via Stripe
          Stripe.charge.create({
            //Stripe wants prices in cents
            amount: Math.ceil(totalCostUSD * 100),
            currency: 'usd',
            source: req.body.stripeToken,
            description: 'AR Meanotte, example change'
          },
          (err, charge) => {
            if(err && err.type === 'StripeCardError'){
              return res
                status(status.INTERNAL_SERVER_ERROR).
                json({ error: error.toString() });
            }

            if (err) {
              console.log(err);
              return res
                .status(status.INTERNAL_SERVER_ERROR).
                .json({ error: err.toString() });
            }

            req.user.data.cart = [];
            req.user.save(() => res.json({id: charge.id}));
          }
        );

        });
    }));


  // the Category API
  // Get a category by id
  api.get('/category/id/:id', wagner.invoke((Category) =>
    (req, res) => {
      Category.findOne({
        _id: req.params.id
      }, (error, category) => {
        if (error) {
          return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json({
              error: error.toString()
            });
        }

        if (!category) {
          return res
            .status(status.NOTFOUND)
            .json({
              error: 'Not found'
            });
        }

        res.json({
          category: category
        });
      });
    }
  ));

  // Get children categories by parent
  api.get('/category/parent/:id', wagner.invoke((Category) =>
    (req, res) => {
      Category
        .find({
          parent: req.params.id
        })
        .sort({
          _id: 1
        })
        .exec((error, categories) => {
          if (error) {
            return res
              .status(status.INTERNAL_SERVER_ERROR)
              .json({
                error: error.toString()
              });
          }

          res.json({
            categories: categories
          });
        });
    }
  ));

  // The Product api

  // Get the product by id
  api.get('/product/id/:id', wagner.invoke((Product) =>
    (req, res) => {
      Product.findOne({
        _id: req.params.id
      }, (error, product) => {
        if (error) {
          return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json({
              error: error.toString()
            });
        }

        if (!product) {
          return res
            .status(status.NOTFOUND)
            .json({
              error: 'Not found'
            });
        }

        res.json({
          product: product
        });
      });

    }
  ));

  // The User api

  api.get('/user/id/:id', wagner.invoke((User) =>
    (req, res) => {
      User.findOne({
        _id: req.params.id
      }, (error, user) => {
        if (error) {
          return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json({
              error: error.toString()
            });
        }

        if (!user) {
          return res
            .status(status.NOTFOUND)
            .json({
              error: 'Not found'
            });
        }

        return res.json({
          user: user
        });

      });
    }
  ));

  api.get('/product/category/:id', wagner.invoke((Product) =>
    (req, res) => {
      const sort = {
        name: 1
      };
      if (req.query.price === '1') {
        sort = {
          'internal.approximatePriceUSD': 1
        };
      } else if (req.query.price === '-1') {
        sort = {
          'internal.approximatePriceUSD': -1
        };
      }

      Product
        .find({
          'category.ancestors': req.params.id
        })
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
      .json({
        error: error.toString()
      });
  }

  if (!result) {
    return res
      .status(status.NOT_FOUND)
      .json({
        error: 'Not found'
      });
  }

  const json = {};
  json[property] = result;
  res.json(json);
}

function handleMany(property, res, error, result) {
  if (error) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({
        error: error.toString()
      });
  }

  const json = {};
  json[property] = result;
  res.json(json);
}
