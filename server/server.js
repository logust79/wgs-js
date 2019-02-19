// @flow
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
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

const sess = {
  secret: "awesome ness",
  resave: false,
  saveUninitialized: false
};
app.use(session(sess));

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

app.get("/combo", (req, res) => {
  // initialise req.session
  req.session.page = 0;
  req.session.formParameters = {};
  // combo
  const limit = 20;
  Combo.find()
    .sort({ caddMean: -1 })
    .limit(limit)
    .exec((_, data) => {
      return res.json({ success: true, data: data });
    });
});

app.get("/combo/page/:change", (req, res) => {
  // page
  const limit = 20;
  const page = req.session.page
    ? req.session.page + parseInt(req.params.change)
    : parseInt(req.params.change);
  if (page < 0) {
    req.session.page = 0;
  } else {
    req.session.page = page;
  }
  let find = null;
  if (
    Object.entries(req.session.formParameters).length > 0 &&
    req.session.formParameters.andConditions.length > 0
  ) {
    find = Combo.find({
      $and: req.session.formParameters.andConditions
    }).sort({
      [req.session.formParameters.sortKey]: -1
    });
  } else {
    find = Combo.find().sort({ caddMean: -1 });
  }
  find
    .skip(limit * req.session.page)
    .limit(limit)
    .exec((_, data) => {
      return res.json({ success: true, data: data });
    });
});

app.post("/combo", (req, res) => {
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
  req.session.formParameters = {
    andConditions,
    sortKey: req.body.formParameters.sortKey.value
  };
  req.session.page = 0;
  let find = null;
  if (andConditions.length > 0) {
    find = Combo.find({ $and: andConditions });
  } else {
    find = Combo.find();
  }
  find
    .sort({ [req.body.formParameters.sortKey.value]: -1 })
    .limit(20)
    .exec((_, data) => {
      return res.json({ success: true, data: data });
    });
});

app.listen(process.env.PORT || 8080);
