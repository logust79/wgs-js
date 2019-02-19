interface Choice {
  label: string;
  value: string | boolean;
  checked: boolean;
}
export interface Filter {
  name: string;
  key: string;
  elemMatch: boolean;
  type: string;
  choices: Choice[];
  action: string;
  value?: string | boolean | number | null;
  default: string | boolean | number | null;
  helperText: string;
  includeNull: boolean | null;
}

interface SortKeyChoice {
  value: string;
  label: string;
}
export interface SortKey {
  choices: SortKeyChoice[];
  value: string;
}
const FormParameters = {
  filters: [
    {
      name: "gnomAD AF",
      key: "gnomadAFLow",
      elemMatch: false,
      type: "text",
      choices: [],
      action: "lte",
      default: 0.05,
      helperText: "gnomAD AF cutoff, range [0, 0.05]",
      includeNull: true
    },
    {
      name: "gnomAD HF",
      key: "gnomadHFLow",
      elemMatch: false,
      type: "text",
      choices: [],
      action: "lte",
      default: 0.0001,
      helperText: "gnomAD hom frequency cutoff, range [0, 0.0001]",
      includeNull: true
    },
    {
      name: "Distance2cds",
      key: "distance2cdsMax",
      elemMatch: false,
      type: "text",
      choices: [],
      action: "lte",
      default: null,
      helperText:
        "how far away a variant is to a cds, range [0, empty(infinite)]",
      includeNull: false
    },
    {
      name: "Filter",
      key: "filterWorst",
      elemMatch: false,
      type: "checkbox",
      choices: [{ label: "PASS only", value: "PASS", checked: false }],
      action: "eq",
      default: null,
      helperText: "include passed variants only, default false",
      includeNull: null
    },
    {
      name: "Number of Het",
      key: "hetCarrierMax",
      elemMatch: false,
      type: "text",
      choices: [],
      action: "lte",
      default: null,
      helperText: "max number of Het carriers(excluding proband), default null",
      includeNull: null
    },
    {
      name: "Number of Hom",
      key: "homCarrierMax",
      elemMatch: false,
      type: "text",
      choices: [],
      action: "lte",
      default: null,
      helperText: "max number of Hom carriers(excluding proband), default null",
      includeNull: null
    },
    {
      name: "Known gene lists",
      key: "knownGeneList",
      elemMatch: true,
      type: "checkbox",
      choices: [
        { label: "RetNet", value: "retnet", checked: false },
        { label: "UKIRDC", value: "ukirdc", checked: false },
        { label: "Steph whole gene list", value: "stephAll", checked: false },
        {
          label: "Steph interesting gene list",
          value: "stephInteresting",
          checked: false
        }
      ],
      action: "eq",
      default: null,
      helperText:
        "display only genes in the selected gene list(s), default not doing so",
      includeNull: null
    },
    {
      name: "Has coding change",
      key: "hasCoding",
      elemMatch: false,
      type: "checkbox",
      choices: [{ label: "At least one", value: "hasCoding", checked: false }],
      action: "eq",
      default: false,
      helperText:
        "a combo needs to at least have one coding variant, default false",
      includeNull: null
    }
  ],
  skip: 0,
  limit: 20,
  sortKey: {
    choices: [
      { label: "Mean CADD", value: "caddMean" },
      { label: "Highest CADD", value: "caddHigh" },
      { label: "Lowest CADD", value: "caddLow" }
    ],
    value: "caddMean"
  }
};

export default FormParameters;
