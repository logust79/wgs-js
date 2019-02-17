const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const VariantSchema = new Schema(
  {
    variantId: String,
    genes: [String],
    gnomadAF: Number,
    gnomadHF: Number,
    bravoAF: Number,
    bravoHF: Number,
    kaviarAF: Number,
    cadd: Number,
    hgvsc: String,
    hgvsp: String,
    distance2cds: Number,
    filter: String,
    hetCarrier: [String],
    homCarrier: [String],
    impact: Number,
    consequence: String,
    missCount: Number,
    genes: [String],
    userComment: String,
    userBenign: Boolean
  },
  { collection: "variant" }
);

// export
module.exports = mongoose.model("variant", VariantSchema);
