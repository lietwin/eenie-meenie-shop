const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  profile: {
    username: { type: String, required: true, lowercase: true },
    picture: { type: String, required: true, match: /^http:\/\//i }
  },
  data: {
    oauth: String,
    cart:[{
      product:{ type: mongoose.Schema.Types.ObjectId },
      quantity: { type: Number, default: 1, min: 1 }
    }]
  }
});
