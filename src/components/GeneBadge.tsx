import * as React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import axios from "axios";
import "../styles/GeneBadge.css";

export interface Props {
  gene: string;
  palette?: Array<string>;
}

interface KnownGene {
  listFullName: string;
  listShortName: string;
  in: boolean;
  color: string;
}
interface State {
  data: KnownGene[];
}
export default class GeneBadge extends React.Component<Props, State> {
  palette = this.props.palette || [
    "red",
    "blue",
    "green",
    "orange",
    "steelblue",
    "grey"
  ];

  constructor(props: Props) {
    super(props);
    this.state = {
      data: [{ listFullName: "", listShortName: "", in: false, color: "" }]
    };
  }
  componentDidMount() {
    axios.get(`/gene/${this.props.gene}`).then(res => {
      this.setState({
        data: res.data.data.map((d: any, i: number) => {
          return {
            listFullName: d.fullName,
            listShortName: d.shortName,
            in: d.in,
            color: this.palette[i]
          };
        })
      });
    });
  }
  render() {
    const spanContent = this.state.data.map(d => {
      if (d.in) {
        const geneStyle = { color: d.color };
        return (
          <Tooltip title={d.listFullName} key={d.listFullName}>
            <span className="geneBadge" style={geneStyle}>
              {d.listShortName}
            </span>
          </Tooltip>
        );
      } else {
        return;
      }
    });
    return (
      <li className="geneCell">
        <span className="geneCellSpan">{this.props.gene}</span> {spanContent}
      </li>
    );
  }
}
