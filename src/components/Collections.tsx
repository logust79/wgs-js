import * as React from "react";
import { RouteComponentProps, withRouter, Link } from "react-router-dom";
//import MaterialIcon from "@material/react-material-icon";
import axios from "axios";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import "../styles/Collections.css";

interface Collection {
  name: string;
  moi: "recessive" | "dominant" | "";
  link: string;
  show: boolean;
  collectionName: string;
}

interface Sample {
  sampleId: string;
  collectionName: string;
  parameter: any;
}
interface State {
  collections: Collection[];
  searchString: string;
}
interface Props extends RouteComponentProps<any> {
  baseUrl: String;
}

class Collections extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchString: "",
      collections: [
        {
          name: "",
          moi: "",
          link: "",
          collectionName: "",
          show: false
        }
      ]
    };
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // update value of cutoffs
    const { value } = e.currentTarget;
    this.setState({
      searchString: value
    });
  };

  componentDidMount() {
    const url = (this.props.baseUrl ? this.props.baseUrl : "") + "/collections";
    axios.get(url).then(res => {
      this.setState({
        collections: res.data.data
          .sort((a: Sample, b: Sample) => {
            // sort collections
            if (a.sampleId < b.sampleId) {
              return -1;
            } else if (
              a.sampleId === b.sampleId &&
              a.parameter.moi < b.parameter.moi
            ) {
              return -1;
            }
            return 1;
          })
          .map((s: Sample) => {
            // set state
            const { moi } = s.parameter;
            return {
              name: s.sampleId,
              moi: moi === "r" ? "recessive" : moi === "d" ? "dominant" : moi,
              collectionName: s.collectionName,
              link: `/sample/${s.collectionName}`,
              show: true
            };
          })
      });
    });
  }
  render() {
    const { searchString, collections } = this.state;
    return (
      <React.Fragment>
        <div className="search-bar">
          <TextField
            label="Search field"
            type="search"
            margin="normal"
            onChange={this.onChange}
            value={this.state.searchString}
          />
        </div>
        <div className="main">
          {collections.map(sample => {
            console.log(sample.name, searchString);
            if (
              !searchString ||
              sample.name
                .toLocaleLowerCase()
                .indexOf(searchString.toLocaleLowerCase()) !== -1
            ) {
              return (
                <Card key={sample.collectionName} className="card">
                  <CardContent>
                    <div className="card-div">
                      <Typography variant="h6">{sample.name}</Typography>
                      <Typography variant="subtitle2">{sample.moi}</Typography>
                    </div>
                    <Typography variant="body2">
                      <Link to={sample.link}>Click to see details</Link>
                    </Typography>
                  </CardContent>
                </Card>
              );
            } else {
              return;
            }
          })}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Collections);
