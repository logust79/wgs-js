import * as React from "react";
import "./App.css";
import Wgs from "./components/Wgs";

class App extends React.Component<Object, Object> {
  public render() {
    return (
      <div className="App">
        <Wgs />
      </div>
    );
  }
}

export default App;
