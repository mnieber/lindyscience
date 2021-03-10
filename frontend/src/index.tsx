import 'react-app-polyfill/ie9';
import 'draft-js/dist/Draft.css';
import 'react-contexify/dist/ReactContexify.min.css';

import 'src/scss/app.scss';
import 'src/scss/modal.scss';
import 'src/scss/react-table.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { configureStore } from 'src/app/store';
import { DisplayProvider } from 'src/session/DisplayProvider';
import { MoveListsCtrProvider } from 'src/move_lists/MovelistsCtrProvider';
import { MovesCtrProvider } from 'src/moves/MovesCtr/MovesCtrProvider';
import { AppFrame } from 'src/app/containers/AppFrame';
import { UrlRouter } from 'src/app/containers/UrlRouter';

configureStore();

ReactDOM.render(
  <DisplayProvider>
    <MoveListsCtrProvider>
      <MovesCtrProvider>
        <AppFrame>
          <UrlRouter />
        </AppFrame>
      </MovesCtrProvider>
    </MoveListsCtrProvider>
  </DisplayProvider>,
  document.getElementById('root')
);
