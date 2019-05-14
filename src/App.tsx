import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Wgs from "./components/Wgs";
import Collections from "./components/Collections";
//import * as lodash from "lodash";

class App extends React.Component<Object, Object> {
  public render() {
    const props = { baseUrl: "http://localhost:8080" };
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route
              exact
              strict
              path="/"
              render={routeProps => <Collections {...routeProps} {...props} />}
            />
            <Route
              exact
              strict
              path="/sample/:collectionName"
              render={routeProps => <Wgs {...routeProps} {...props} />}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
