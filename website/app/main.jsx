import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { getStore } from "app/store";
import UrlRouter from "screens/containers/urlrouter";

ReactDOM.render(
  <Provider store={getStore()}>
    <UrlRouter />;
  </Provider>,
  document.getElementById("root")
);
