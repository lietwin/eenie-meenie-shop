const wagner = require('wagner');
const fs = require('fs');
const Stripe = require('stripe');
const fx = require('./fx.js');

module.exports = (wagner) => {
  // getting the Stripe key for the Config Service
  wagner.factory('Stripe', () => Stripe(Config.stripeKey));
 // Inject FX dependency: open exchange rates
  wagner.factory('fx', fx);
  wagner.factory('Config',
                () => JSON.parse(fs.readFileSync('./config.json').toString()));
  
}
