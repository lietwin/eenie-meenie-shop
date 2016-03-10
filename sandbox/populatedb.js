const mongoose = require('mongoose');
const utils = require('../utils/utils.js');
const userSchema = require('../user');
const Cat = require('../category');
const Prod = require('../product');

mongoose.connect('mongodb://localhost:27017/shop');

// Quick example to test my understanding
const User = mongoose.model('User', userSchema);

const user = new User({
  profile: {
    username: 'Lietwin',
    picture: 'http://i3.cpcache.com/product/1508322558/purple_dragon_pillow_case.jpg'
  }
});

user.save((error, user) => {
  utils.handleError(error);
  console.log(JSON.stringify(user));
});

const Category = mongoose.model('Category', Cat.categorySchema);
const electronics = new Category({ _id: 'Electronics' });
const smartphones = new Category({ _id: 'Smartphones', parent: electronics,
  ancestors: [electronics] });

electronics.save((error, cat) => {
  utils.handleError(error);
  console.log(JSON.stringify(cat));
});

smartphones.save((error, cat) => {
  utils.handleError(error);
  console.log(JSON.stringify(cat));
});

Category.find((error, docs) => {
  utils.handleError(error);
  console.log('Existing categories');
  console.log(docs);
});

const Product = mongoose.model('Product', Prod.productSchema);
const iphone = new Product({
  name: 'iPhone 4',
  pictures: ['http://i.ebayimg.com/images/i/371222340321-0-1/s-l1000.jpg'],
  price: {
    amount:8,
    currency: 'EUR'
  },
  category: smartphones
});

iphone.save((error, prod) => {
  utils.handleError(error);
  console.log('Existing products');
  console.log(JSON.stringify(prod));
});

process.exit(0);
