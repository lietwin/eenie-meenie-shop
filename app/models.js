const mongoose = require('mongoose');
const wagner = require('wagner-core');

module.exports = (wagner) => {
  mongoose.connect('mongodb://localhost:27017/shop');

  // Category model creation and registration
  const Category = mongoose.model('Category', require('./category'), 'categories');
  wagner.factory('Category', () => Category);

  // Product model creation and registration
  const Product = mongoose.model('Product', require('./product'), 'products');
  wagner.factory('Product', () => Product);

  // User model creation and service registration
  const User = mongoose.model('User', require('./user'), 'users');
  wagner.factory('User', () => User);

  // return models
  return { Category, Product, User };
};
