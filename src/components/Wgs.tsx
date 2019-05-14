import * as React from "react";
//import MaterialIcon from "@material/react-material-icon";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";
import "@material/react-text-field/dist/text-field.css";
import Form from "./Form";
import "../styles/Wgs.css";
import FormParameters from "../FormParameters";
import WgsTable, { Record as TableProps } from "./WgsTable";
import { Props as FormProps } from "./Form";
//import * as lodash from "lodash";

interface State {
  formParameters: FormProps;
  tableData: TableProps[];
  page: number;
  count: number;
}
interface Props extends RouteComponentProps<any> {
  baseUrl: String;
}
export default class Wgs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      formParameters: FormParameters,
      tableData: [{ variants: [], genes: [] }],
      count: 0,
      page: 0
    };
  }

  componentDidMount() {
    const { collectionName } = this.props.match.params;
    const url =
      (this.props.baseUrl ? this.props.baseUrl : "") +
      "/sample/" +
      collectionName;
    console.log(url);
    const { filters } = this.state.formParameters;
    axios.get(url).then(res => {
      console.log(res);
      const newFilters = filters.map((param: any) => {
        console.log(param);
        if (param.key === "gnomadAFHigh") {
          return { ...param, value: res.data.parameter.parameter.gnomad_af };
        } else if (param.key === "gnomadHFHigh") {
          return { ...param, value: res.data.parameter.parameter.gnomad_hom_f };
        }
        return param;
      });
      this.setState({
        formParameters: { ...this.state.formParameters, filters: newFilters },
        tableData: res.data.data.map((d: any) => {
          return { variants: d.variants, genes: d.genes };
        }),
        count: res.data.count
      });
    });
  }

  onChange = (e: React.FormEvent<HTMLInputElement>) => {
    // update value of cutoffs
    const { name, value } = e.currentTarget;
    if (name === "sortKey") {
      // this one is special, need to deal separately
      const sortKey = {
        ...this.state.formParameters.sortKey,
        value
      };
      this.setState({
        formParameters: { ...this.state.formParameters, sortKey }
      });
    } else {
      const filters = this.state.formParameters.filters.map(d => {
        if (d.key === name) {
          // update choices if type == checkbox
          let choices: Array<any> = [],
            V = value.match(/^ *$/) !== null ? null : value;
          if (d.type === "checkbox") {
            choices = d.choices.map(c => {
              if (c.value === value) {
                if (c.checked) {
                  V = null;
                }
                return { ...c, checked: !c.checked };
              }
              return c;
            });
          }
          return { ...d, value: V, choices };
        } else {
          return d;
        }
      });
      this.setState({
        formParameters: { ...this.state.formParameters, filters }
      });
    }
  };

  onPageChange = (n: number) => {
    const { collectionName } = this.props.match.params;
    const url =
      (this.props.baseUrl ? this.props.baseUrl : "") +
      `/sample/${collectionName}/page/${n}`;
    axios.get(url).then(res => {
      this.setState({
        tableData: res.data.data.map((d: any) => {
          return { variants: d.variants, genes: d.genes };
        }),
        page: this.state.page + n
      });
    });
  };
  onSubmit = (e: any) => {
    e.preventDefault();
    // get our form data out of state
    const { formParameters } = this.state;
    const { collectionName } = this.props.match.params;
    const url =
      (this.props.baseUrl ? this.props.baseUrl : "") +
      `/sample/${collectionName}`;
    axios.post(url, { formParameters }).then(res => {
      this.setState({
        tableData: res.data.data.map((d: any) => {
          return { variants: d.variants, genes: d.genes };
        }),
        count: res.data.count
      });
    });
  };
  render() {
    const { formParameters, tableData, page, count } = this.state;
    return (
      <React.Fragment>
        <div className="sidebar">
          <Form
            onSubmit={this.onSubmit}
            onChange={this.onChange}
            filters={formParameters.filters}
            skip={formParameters.skip}
            limit={formParameters.limit}
            sortKey={formParameters.sortKey}
          />
        </div>
        <div className="table">
          <WgsTable
            data={tableData}
            onPageChange={this.onPageChange}
            page={page}
            count={count}
            baseUrl={this.props.baseUrl}
          />
        </div>
      </React.Fragment>
    );
  }
}
