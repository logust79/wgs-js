const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
// collection binding needs to happen in the route handler
const ComboSchema = new Schema({
  variants: [String],
  genes: [String],
  caddMean: Number,
  hasUserBenign: Boolean
});

// export
module.exports = ComboSchema;
