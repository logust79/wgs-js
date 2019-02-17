// @flow
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const Gene = require("./gene");
const Variant = require("./variant");
const Combo = require("./combo");
// connect to db
const dbRoute = "mongodb://localhost:27017/3002";
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));
// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "build")));

app.get("/ping", (req, res) => {
  return res.send("pong");
});

app.get("/variant/:variantId", (req, res) => {
  const { variantId } = req.params;
  Variant.findOne({ variantId }, (_, data) => {
    // sort pop
    const pop = ["gnomadAF", "gnomadHF", "bravoAF", "bravoHF", "kaviarAF"].map(
      d => {
        return { name: d, value: data[d] };
      }
    );
    return res.json({ success: true, data: { ...data._doc, pop } });
  });
});

app.get("/gene/:symbol", (req, res) => {
  const shortNameDict = {
    retnet: "R",
    ukirdc: "U",
    stephAll: "SA",
    stephInteresting: "SI"
  };
  const { symbol } = req.params;
  Gene.findOne({ symbol }, (_, data) => {
    const geneList = data._doc.knownGeneList.map(d => {
      return {
        fullName: d.name,
        shortName: shortNameDict[d.name],
        in: d.in
      };
    });
    return res.json({ success: true, data: geneList });
  });
});

const CutoffsTransformer = cutoffs => {
  const Texts = [
    "gnomadAF",
    "gnomadHF",
    "internalAF",
    "internalHF",
    "distance2cdsMax"
  ];
  const Radios = {
    excludeNonCoding: [""]
  };
  return Object.keys(cutoffs).map(key => {
    return { id: key, type: key in ["gnomadAF", "gnomadHF", ""] };
  });
};

app.get("/combo", (_, res) => {
  // combo
  const limit = 20;
  const cutoffs = {
    gnomad_af: 0.05,
    gnomad_hom_f: 0.0001,
    internal_af: 0.1,
    internal_hom_f: 0.03,
    pop_including_none: true,
    exclude_failed_variants: true,
    exclude_vqsr_variants: false,
    remove_nc: false
  };
  Combo.find()
    .sort({ caddMean: -1 })
    .limit(limit)
    .exec((_, data) => {
      return res.json({ success: true, data: data, cutoffs: cutoffs });
    });
});

app.listen(process.env.PORT || 8080);
