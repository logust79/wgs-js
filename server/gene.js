const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const GeneSchema = new Schema(
  {
    geneId: String,
    symbol: String,
    stephAll: Boolean,
    stephInteresting: Boolean,
    ukirdc: Boolean
  },
  { collection: "gene" }
);

// export
module.exports = mongoose.model("gene", GeneSchema);
