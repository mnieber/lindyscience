import React from 'react';
import ReactDOM from 'react-dom'
import { getStore } from 'app/store'
import { Provider } from 'react-redux'
import UrlRouter from 'app/containers/urlrouter'

ReactDOM.render(
  <Provider store={getStore()}>
    <UrlRouter/>
  </Provider>
  , document.getElementById('root')
);
