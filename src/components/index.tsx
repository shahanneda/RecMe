import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";
ReactDOM.render(
  <App url="192.168.1.99:4564" />,
  document.getElementById("output")
);