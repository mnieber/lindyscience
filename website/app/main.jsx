import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { getStore } from "app/store";
import UrlRouter from "screens/containers/urlrouter";

import "scss/app.scss";
import "scss/modal.scss";
import "draft-js/dist/Draft.css";
import "scss/react-table.scss";

import "react-contexify/dist/ReactContexify.min.css";
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";

ReactDOM.render(
  <Provider store={getStore()}>
    <UrlRouter />
  </Provider>,
  document.getElementById("root")
);
