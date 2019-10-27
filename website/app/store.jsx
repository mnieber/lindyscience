// @notyetflow

import Cookies from "js-cookie";
import jQuery from "jquery";
import thunk from "redux-thunk";
import { spy } from "utils/mobx_wrapper";
import { createLogger } from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import { reducer } from "app/root_reducer";

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
}

const configureStore = () => {
  jQuery.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", Cookies.get("csrftoken"));
      }
      if (Cookies.get("authToken") && settings.url !== "/auth/token/login") {
        xhr.setRequestHeader(
          "Authorization",
          "Token " + Cookies.get("authToken")
        );
      }
    },
    traditional: true,
  });

  const logRedux = true;
  const logMobx = true;
  const blackList = ["relayData"];

  let middleware = [thunk];
  if (process.env.NODE_ENV !== "production") {
    middleware = [...middleware, ...(logRedux ? [createLogger()] : [])];
  }

  if (logMobx) {
    spy(event => {
      if (
        event.type === "action" &&
        !blackList.includes(event.name.split(" ")[0])
      ) {
        const args = event.arguments.length
          ? ` with args: ${event.arguments}`
          : "";
        const css = "background: #222; color: #bada55";
        (console: any).log(`%c${event.name}`, css, `${args}`);
      }
    });
  }

  const store = createStore(reducer, applyMiddleware(...middleware));

  return store;
};

var _store = undefined;

export function getStore() {
  _store = _store || configureStore();
  return _store;
}

export default configureStore;
