const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const ParameterSchema = new Schema(
  {
    sampleId: String,
    collectionName: String,
    parameter: Object
  },
  { collection: "parameter" }
);

// export
module.exports = mongoose.model("parameter", ParameterSchema);
