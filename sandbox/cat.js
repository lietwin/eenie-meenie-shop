const utils = require("../utils/utils");
const mongoose = require("mongoose");

const catSchema = {
  name: {type: String, required: true},
};

module.exports = new mongoose.Schema(catSchema);
module.exports.catSchema = catSchema ;
