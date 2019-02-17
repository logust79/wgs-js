import * as React from "react";
import axios from "axios";
import "./App.css";
import Wgs, { Props } from "./components/Wgs";

type State = {
  data: String;
};
class App extends React.Component<Object, State> {
  state: State = {
    data: "nothingness"
  };
  componentDidMount() {
    console.log("wef");
    axios
      .get("/ping")
      .then(res => {
        console.log(res);
        this.setState({ data: res.data });
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  }
  public render() {
    const { data } = this.state;
    const props: Props = {
      moi: "r",
      cutoffs: [
        {
          id: "gnomadAf",
          default: 0.0001,
          type: "text",
          choices: [],
          helperTextGenerator: (d: number) => `a gnomAD AF cutoff of (<= ${d})`
        }
      ]
    };
    return (
      <div className="App">
        <p>{data}</p>
        <Wgs moi={props.moi} cutoffs={props.cutoffs} />
      </div>
    );
  }
}

export default App;
