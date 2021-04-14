import 'react-app-polyfill/ie9';
import 'draft-js/dist/Draft.css';
import 'react-contexify/dist/ReactContexify.min.css';

import 'src/scss/app.scss';
import 'src/scss/modal.scss';
import 'src/scss/react-table.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { configureStore } from 'src/app/store';
import { App } from 'src/app/components';

configureStore();

const strict = false;

ReactDOM.render(
  strict ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <App />
  ),
  document.getElementById('root')
);
