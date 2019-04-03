// @flow
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const Gene = require("./models/gene");
const Variant = require("./models/variant");
const Parameter = require("./models/parameter");
const ComboSchema = require("./models/combo");
// connect to db
const dbRoute = "mongodb://localhost:27017/UKIRDC-WGS";
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

const sess = {
  secret: "awesome ness",
  resave: false,
  saveUninitialized: false
};
app.use(session(sess));

app.get("/collections", (req, res) => {
  Parameter.find({}, (_, data) => {
    return res.json({ success: true, data: data });
  });
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

app.get("/sample/:collectionName", (req, res) => {
  // initialise req.session
  // req.session.page = 0;
  // req.session.formParameters = {};
  // sample
  const sample = req.params.collectionName;
  const Combo = mongoose.model(sample, ComboSchema, sample);
  const limit = 20;
  const promise1 = Combo.countDocuments();
  const promise2 = Combo.find()
    .sort({ caddMean: -1 })
    .limit(limit)
    .exec();
  const promise3 = Parameter.findOne({ collectionName: sample }).exec();
  Promise.all([promise1, promise2, promise3]).then(results => {
    return res.json({
      success: true,
      data: results[1],
      count: results[0],
      parameter: results[2]
    });
  });
});

app.get("/sample/:collectionName/page/:change", (req, res) => {
  // page
  const limit = 20;
  const sample = req.params.collectionName;
  const Combo = mongoose.model(sample, ComboSchema, sample);
  let collection = req.session[sample] || {
    page: 0,
    formParameters: {}
  };
  const page = collection.page + parseInt(req.params.change);
  if (page < 0) {
    collection.page = 0;
  } else {
    collection.page = page;
  }
  req.session[sample] = collection;
  let find = null;
  if (
    Object.entries(collection.formParameters).length > 0 &&
    collection.formParameters.andConditions.length > 0
  ) {
    find = Combo.find({
      $and: collection.formParameters.andConditions
    }).sort({
      [collection.formParameters.sortKey]: -1
    });
  } else {
    find = Combo.find().sort({ caddMean: -1 });
  }
  find
    .skip(limit * collection.page)
    .limit(limit)
    .exec((_, data) => {
      return res.json({ success: true, data: data });
    });
});

app.post("/sample/:collectionName", (req, res) => {
  const sample = req.params.collectionName;
  const Combo = mongoose.model(sample, ComboSchema, sample);
  // remove unchanged filters relative to defaults
  const filters = req.body.formParameters.filters
    .filter(d => d.value !== d.default)
    .map(d => {
      if (d.elemMatch) {
        return d.choices
          .filter(ele => ele.checked)
          .map(ele => {
            return { [d.key]: { $elemMatch: { name: ele.value, in: true } } };
          });
      } else if (d.type === "checkbox") {
        return { [d.key]: d.value === d.key ? true : d.value };
      } else if (
        d.type === "text" &&
        ["lte", "lt", "gte", "gt"].includes(d.action)
      ) {
        // gnomAD, het/hom carriers
        if (d.includeNull) {
          return {
            $or: [
              { [d.key]: { [`\$${d.action}`]: Number(d.value) } },
              { [d.key]: null }
            ]
          };
        } else {
          return { [d.key]: { [`\$${d.action}`]: Number(d.value) } };
        }
      } else if (d.type === "text" && d.action === "eq") {
        if (d.key === "chromosomes") {
          // chromosomes
          return {
            chrom: { $in: d.value.toUpperCase().split(" ") }
          };
        }
        // genes
        return {
          $or: d.value
            .toUpperCase()
            .split(" ")
            .map(gene => {
              return { genes: gene };
            })
        };
      }
    });
  const andConditions = [].concat.apply([], filters);
  req.session[sample] = {
    formParameters: {
      andConditions,
      sortKey: req.body.formParameters.sortKey.value
    },
    page: 0
  };
  let find = null,
    promise1 = null;
  if (andConditions.length > 0) {
    find = Combo.find({ $and: andConditions });
    promise1 = Combo.countDocuments({ $and: andConditions });
  } else {
    find = Combo.find();
    promise1 = Combo.countDocuments();
  }
  promise2 = find
    .sort({ [req.body.formParameters.sortKey.value]: -1 })
    .limit(20)
    .exec();
  Promise.all([promise1, promise2]).then(results => {
    return res.json({ success: true, data: results[1], count: results[0] });
  });
});

app.listen(process.env.PORT || 8080);
