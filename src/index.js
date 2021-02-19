import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import Application from "./components/Application";

import "./index.css";

/*
  Notes:

  - https://www.npmjs.com/package/react-router-hash-link
  - https://www.npmjs.com/package/react-update-url-on-scroll
*/

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Application />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
