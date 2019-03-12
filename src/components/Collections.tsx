import * as React from "react";
import { RouteComponentProps, withRouter, Link } from "react-router-dom";
//import MaterialIcon from "@material/react-material-icon";
import axios from "axios";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import "../styles/Collections.css";
//import * as lodash from "lodash";

interface Collection {
  name: string;
  moi: "recessive" | "dominant" | "";
  link: string;
  show: boolean;
  collectionName: string;
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
  componentDidMount() {
    const url = (this.props.baseUrl ? this.props.baseUrl : "") + "/collections";
    axios.get(url).then(res => {
      this.setState({
        collections: res.data.data.map((s: any) => {
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
      <div className="main">
        {collections.map(sample => {
          if (
            !searchString ||
            sample.name
              .toLocaleLowerCase()
              .indexOf(searchString.toLocaleLowerCase())
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
    );
  }
}

export default withRouter(Collections);
