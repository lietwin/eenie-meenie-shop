const mongoose = require('mongoose');
const fx = require('./fx');

const productSchema = {
  name: { type: String, required: true },

  // Pictures must start with http://
  pictures: [{ type: String, match: /^http:\/\//i }],
  price: {
    amount: { type: Number, required: true },
    set: (value) => {
      this.internal.approximatePriceUSD =
        value / (fx()[this.price.currency] || 1);
      return value;
    }
    // Only 3 currencies for now
    currency: { type: String, enum: ['USD', 'EUR', 'GBP'], required: true },
    set: (value) => {
      this.internal.approximatePriceUSD =
        this.price.amount / (fx()[value] || 1);
      return value;
    }
  },
  category: require('./category').categorySchema,
  internal: {
    approximatePriceUSD: Number
  }
};

const currencySymbols = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£'
};

/*
 * Human-readable string form of price - "$25" rather
 * than "25 USD"
 */
schema.virtual('displayPrice').get(function() {
  return currencySymbols[this.price.currency] +
    '' + this.price.amount;
});
// For Mongoose to convert js <-> json

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

module.exports = new mongoose.Schema(productSchema);
module.exports.productSchema = productSchema;
