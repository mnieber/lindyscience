// @notyetflow

import Cookies from 'js-cookie'
import jQuery from 'jquery';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { reducer as movesReducer } from 'moves/reducers'
import { reducer as appReducer } from 'app/reducers'
import { reducer as toastrReducer } from 'react-redux-toastr'


function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

const configureStore = () => {
  jQuery.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
      }
    },
    traditional: true
  });

  let middleware = [thunk];
  if (process.env.NODE_ENV !== 'production') {
    middleware = [...middleware, createLogger()];
  }

  const store = createStore(
    combineReducers({
      toastr: toastrReducer,
      moves: movesReducer,
      app: appReducer,
    }),
    applyMiddleware(...middleware)
  )

  return store;
};


var _store = undefined;

export function getStore() {
  _store = _store || configureStore();
  return _store;
}


export default configureStore;
