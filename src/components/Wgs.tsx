import * as React from "react";
//import MaterialIcon from "@material/react-material-icon";
import axios from "axios";
import "@material/react-text-field/dist/text-field.css";
import Form from "./Form";
import "../styles/Wgs.css";
import WgsTable from "./WgsTable";

type helperTextGenerator = (value: string | number | boolean) => string;

interface Parameter {
  // what is it?
  id: string;
  type: "radio" | "text";
  choices: Array<string>;
}
interface PropParameter extends Parameter {
  default: number | string | boolean;
  // a function that returns a string
  helperTextGenerator: helperTextGenerator;
}
interface CutoffParameter extends Parameter {
  value: string | number | boolean;
  helperText: string;
}
interface PropParameters extends Array<PropParameter> {}

export interface Props {
  cutoffs: PropParameters;
  moi: "r" | "d";
}

interface TableData {
  variants: Array<string>;
  genes: Array<string>;
}
interface State {
  cutoffs: CutoffParameter[];
  tableData: TableData[];
  moi: "r" | "d";
}

export default class Wgs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { moi, cutoffs } = props;
    this.state = {
      moi: moi,
      cutoffs: cutoffs.map(d => {
        return {
          id: d.id,
          value: d.default,
          type: d.type,
          helperText: d.helperTextGenerator(d.default),
          choices: d.choices
        };
      }),
      tableData: [{ variants: [], genes: [] }]
    };
  }

  componentDidMount() {
    axios.get("/combo").then(res => {
      this.setState({
        tableData: res.data.data.map((d: any) => {
          return { variants: d.variants, genes: d.genes };
        })
      });
    });
  }

  onChange = (e: any) => {
    // update value of cutoffs
    const cutoffs = this.state.cutoffs.map(d => {
      if (d.id === e.target.name) {
        return { ...d, value: e.target.value };
      } else {
        return d;
      }
    });
    this.setState({ cutoffs });
  };

  onSubmit = (e: any) => {
    e.preventDefault();
    // get our form data out of state
    const { cutoffs } = this.state;

    axios.post("/", { cutoffs }).then(result => {
      //access the results here....
    });
  };
  render() {
    const { cutoffs, moi } = this.state;
    return (
      <React.Fragment>
        <div className="sidebar">
          <h2> MOI: {moi}</h2>
          <Form
            onSubmit={this.onSubmit}
            onChange={this.onChange}
            cutoffs={cutoffs}
          />
        </div>
        <div className="table">
          <WgsTable data={this.state.tableData} />
        </div>
      </React.Fragment>
    );
  }
}
