const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const ComboSchema = new Schema(
  {
    variants: [String],
    genes: [String],
    caddMean: Number,
    hasUserBenign: Boolean
  },
  { collection: "combo" }
);

// export
module.exports = mongoose.model("combo", ComboSchema);
