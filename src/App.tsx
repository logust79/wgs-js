import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Wgs from "./components/Wgs";
import Collections from "./components/Collections";

class App extends React.Component<Object, Object> {
  public render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact strict path="/" component={Collections} />
            <Route
              exact
              strict
              path="/sample/:collectionName"
              component={Wgs}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
