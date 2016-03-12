const assert = require('assert');
const superagent = require('superagent');
const wagner = require('wagner-core');
const express = require('express');

const URL_ROOT = 'http://localhost:3000';

//FIXME(lietwin) Make es6 compliance with babel transpiling

//Category API
describe('Shop Testing Module', () => {
  var server;
  var Category;
  var Product;

  before(() => {
    // Bootstrapping server
    var app = express();

    var models = require('../models')(wagner);

    app.use(require('../api')(wagner));

    console.log('Starting the server ...');
    server = app.listen(3000);

    // Make Category, Product models available
    Category = models.Category;
    Product = models.Product;
  });

  // Stopping the server
  after(() => {
    console.log('Stopping the server ...');
    server.close();
  });

  // Make sure Category empty before each testing
  beforeEach((done) => {
    Category.remove({}, (error) => {
      assert.ifError(error);
      Product.remove({}, (error) => {
        assert.ifError(error);
        done();
      });
    });
  });

  it('Can load category by id', (done) => {
    // Create a category
    Category.create({ _id: 'Electronics' }, (error, category) => {
      assert.ifError();

      // Make an http request to localhost:3000/category/Electronics
      const url = URL_ROOT + '/category/id/Electronics';
      superagent.get(url, (error, res) => {
        assert.ifError(error);
        var result;
        assert.doesNotThrow(() => {
          result = JSON.parse(res.text);
        });
        assert.ok(result.category);
        assert.equal(result.category._id, 'Electronics');
        done();
      });
    });
  });

  it('Can load all categories that have a certain parent', (done) => {
    const ctgs = [
      { _id: 'Electronics' },
      { _id: 'Phones', parent: 'Electronics', ancestors: ['Electronics'] },
      { _id: 'Laptops', parent: 'Electronics', ancestors: ['Electronics'] },
      { _id: 'Books' }
    ];

    //Create categories
    Category.create(ctgs, (error, categories) => {
      assert.ifError(error);

      // Make an http request to localhost:3000/category/parent/electronics
      const url = URL_ROOT + '/category/parent/Electronics';
      superagent.get(url, (error, res) => {
        // Check error
        assert.ifError(error);
        var result;

        //Check parsing does not throw exception
        assert.doesNotThrow(() => {
          result = JSON.parse(res.text);
        });

        // Check result contains categories
        assert.ok(result.categories);

        // Check result.categories has at least one element which parent is Electronics
        //assert.equal(result.categories.length, 2);

        //Check one of the returned categories' parent is Electronics
        // es6   const [oneCat, ...others] = result.categories;
        const oneCat = result.categories[0];
        assert.equal(oneCat.parent, 'Electronics');
        done();
      });
    });
  });

  it('Can load product by id', (done) => {
    //const PRODUCT_ID = '1234567890';
    const item = {
      name: 'iPhone 4',
      pictures: ['http://i.ebayimg.com/images/i/371222340321-0-1/s-l1000.jpg'],
      price: { amount: 8, currency: 'EUR' },
      category: { _id: 'Phones', parent: 'Electronics', ancestors: ['Electronics'] }
    };
    Product.create(item, (error, product) => {
      assert.ifError(error);

      // Send an http request to localhost:3000/product/id/
      const url = URL_ROOT + '/product/id/' + product.id;
      superagent.get(url, (error, res) => {
        // Check for error
        assert.ifError();

        // Check for parsing exception
        var result;
        assert.doesNotThrow(() => {
          result = JSON.parse(res.text);
        });

        // Check result contains an object named product
        assert.ok(result.product);

        // Check the return _id comply with the product _id
        assert.equal(result.product._id, product._id);

        done();
      });
    });
  });

});
