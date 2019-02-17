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
          <span className="pop af">{gnomad.gnomadAF}</span>
        </Tooltip>
        <Tooltip title="gnomAD homozygote frequency" key="gnomadHF">
          <span className="pop hf">{gnomad.gnomadHF}</span>
        </Tooltip>
        <Tooltip title={this.state.hgvsc.split(",").join("\n")} key="hgvsc">
          <span className="hgvs">{firstHgvscShort}</span>
        </Tooltip>
        <Tooltip title={this.state.hgvsp.split(",").join("\n")} key="hgvsp">
          <span className="hgvs">{firstHgvspShort}</span>
        </Tooltip>
        <Tooltip title="CADD phred score" key="cadd">
          <span className="cadd">{this.state.cadd}</span>
        </Tooltip>
        <Tooltip title="Number of het carriers" key="hetCarriers">
          <Badge badgeContent={this.state.hetCarrier.length} color="primary">
            <Button
              variant="contained"
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
