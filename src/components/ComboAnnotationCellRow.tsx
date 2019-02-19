import * as React from "react";
import axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import CarrierModal from "./CarrierModal";
import "../styles/ComboAnnotationRow.css";

export interface Props {
  variant: string;
}

interface Pop {
  name: string;
  value: number | null;
}
interface State {
  pop: Array<Pop>;
  cadd: number;
  hgvsc: string;
  hgvsp: string;
  distance2cds: number | null;
  hetCarrier: Array<string>;
  homCarrier: Array<string>;
  impact: number; // only highest
  consequence: string;
  missCount: number;
  genes: Array<string>;
  hetModal: boolean;
  homModal: boolean;
}

export default class ComboCellVariantRow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pop: [{ name: "", value: null }],
      cadd: 0,
      hgvsc: "",
      hgvsp: "",
      distance2cds: null,
      hetCarrier: [],
      homCarrier: [],
      impact: -1,
      consequence: "",
      missCount: -1,
      genes: [],
      hetModal: false,
      homModal: false
    };
  }
  handleModal = (moi: "hetModal" | "homModal", open: boolean) => {
    if (moi === "hetModal") {
      this.setState({ hetModal: open });
    } else {
      this.setState({ homModal: open });
    }
  };
  componentDidMount() {
    axios.get(`/variant/${this.props.variant}`).then(res => {
      const { data } = res.data;
      this.setState({ ...data });
    });
  }
  toSuperscript = (str: string) => {
    const SYM =
      "        ⁽⁾ ⁺ ⁻  ⁰¹²³⁴⁵⁶⁷⁸⁹   ⁼   ᴬᴮ ᴰᴱ ᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾ ᴿ ᵀᵁ ᵂ         ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖ ʳˢᵗᵘᵛʷˣʸᶻ     ";
    var z = "";
    for (var c of str) {
      var d = SYM[c.charCodeAt(0) - 32] || " ";
      z += d === " " ? c : d;
    }
    return z;
  };
  toScientific(n: number | null, precision: number = 3) {
    if (n === null) {
      return "";
    } else if (n === 0) {
      return "0";
    } else {
      const e = Math.floor(Math.log10(n)),
        m = n * Math.pow(10, -e);
      return (
        m.toPrecision(precision) + "×10" + this.toSuperscript(e.toString())
      );
    }
  }
  truncateString(s: string | null, length: number = 10) {
    if (s === null) {
      return "";
    } else if (s.length > 10) {
      return s.slice(0, 8) + "...";
    } else {
      return s;
    }
  }
  render() {
    // get gnomadAF/HF
    let gnomad: { gnomadAF: number | null; gnomadHF: number | null } = {
      gnomadAF: null,
      gnomadHF: null
    };
    this.state.pop.map(d => {
      if (["gnomadAF", "gnomadHF"].includes(d.name)) {
        gnomad[d.name] = d.value;
      }
    });

    // get a short hgvsc,hgvsp change
    const firstHgvsc = this.state.hgvsc.split(",")[0].split(":");
    const firstHgvsp = this.state.hgvsp.split(",")[0].split(":");
    const firstHgvscShort = firstHgvsc[firstHgvsc.length - 1];
    const firstHgvspShort = firstHgvsp[firstHgvsp.length - 1];

    return (
      <li className="variant" id={this.props.variant}>
        <Tooltip title="gnomAD allele frequency" key="gnomadAF">
          <span className="pop af">{this.toScientific(gnomad.gnomadAF)}</span>
        </Tooltip>
        <Tooltip title="gnomAD homozygote frequency" key="gnomadHF">
          <span className="pop hf">{this.toScientific(gnomad.gnomadHF)}</span>
        </Tooltip>
        <Tooltip title={this.state.hgvsc.split(",").join("\n")} key="hgvsc">
          <span className="hgvs">{this.truncateString(firstHgvscShort)}</span>
        </Tooltip>
        <Tooltip title={this.state.hgvsp.split(",").join("\n")} key="hgvsp">
          <span className="hgvs">{this.truncateString(firstHgvspShort)}</span>
        </Tooltip>
        <Tooltip title="CADD phred score" key="cadd">
          <span className="cadd">{this.state.cadd}</span>
        </Tooltip>
        <Tooltip title="Number of het carriers" key="hetCarriers">
          <Badge
            badgeContent={this.state.hetCarrier.length}
            showZero={true}
            color="primary"
          >
            <Button
              variant="contained"
              size="small"
              className="carrier"
              onClick={() => this.handleModal("hetModal", true)}
            >
              het
            </Button>
            <CarrierModal
              open={this.state.hetModal}
              handleClose={() => this.handleModal("hetModal", false)}
              carriers={this.state.hetCarrier}
            />
          </Badge>
        </Tooltip>
        <Tooltip title="Number of hom carriers" key="homCarriers">
          <Badge
            badgeContent={this.state.homCarrier.length}
            showZero={true}
            color="primary"
          >
            <Button
              variant="contained"
              className="carrier"
              size="small"
              onClick={() => this.handleModal("homModal", true)}
            >
              hom
            </Button>
            <CarrierModal
              open={this.state.homModal}
              handleClose={() => this.handleModal("homModal", false)}
              carriers={this.state.homCarrier}
            />
          </Badge>
        </Tooltip>
      </li>
    );
  }
}
