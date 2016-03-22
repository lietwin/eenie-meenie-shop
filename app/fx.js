const wagner = require('wagner');
const deps = require('./dependencies.js');

module.exports = (wagner) => {
  return {
    USD: 1,
    EUR: 1.1,
    GBP: 1.5
  };
};
