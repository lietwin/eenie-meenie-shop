const utils = require("../utils/utils");
const mongoose = require("mongoose");
const Cat = require("./cat.js");



// TODO(lietwin): add supported image extension and their validation
// TODO(lietwin) Alt by default should be the project title, fix this in pre.save()
// TODO(lietwin) limit the size of images
const refSchema = {
  title: {type: String, required: true},
  imgs: [{
    src: {type: String},
    alt: {type: String} //default is project title
  }],
  cat: { type: String, ref: "Cat" }
};

//, authors:[{
//   mainName: {type: String, required: true},
//   otherName: {type: String},
//   min: 1
// }],
// isTeam: {
//   type: Boolean,
//   required: true,
//   validate: {
//     validator: function(v) {
//       return authors.length == 1 ? v == false : v == true;
//     },
//     message: "authors are more than one, isTeam should be ticked"
//   }
// }

module.exports = new mongoose.Schema(refSchema);
module.exports.refSchema = refSchema;
