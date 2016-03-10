const mongoose = require('mongoose');

const productSchema = {
  name: { type: String, required: true },

  // Pictures must start with http://
  pictures: [{ type: String, match: /^http:\/\//i }],
  price: {
    amount: { type: Number, required: true },

    // Only 3 currencies for now
    currency: { type: String, enum: ['USD', 'EUR', 'GBP'], required: true }
  },
  category: require('./category').categorySchema
};

module.exports = new mongoose.Schema(productSchema);
module.exports.productSchema = productSchema;
