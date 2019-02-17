import * as React from "react";
import axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
import "../styles/ComboCellVariantRow.css";

export interface Props {
  variant: string;
}

interface State {
  filter: string;
}

export default class ComboCellVariantRow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      filter: ""
    };
  }
  componentDidMount() {
    axios.get(`/variant/${this.props.variant}`).then(res => {
      const { data } = res.data;
      this.setState({ ...data });
    });
  }
  render() {
    return (
      <li className="variant" id={this.props.variant}>
        <Tooltip title={this.state.filter} key="variant">
          <span className={this.state.filter === "PASS" ? "pass" : "fail"}>
            {this.props.variant}
          </span>
        </Tooltip>
      </li>
    );
  }
}
