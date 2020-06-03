import 'react-app-polyfill/ie9';
import 'mobx-react/batchingForReactDom';
import 'draft-js/dist/Draft.css';
import 'react-contexify/dist/ReactContexify.min.css';

import 'src/scss/app.generated.css';
import 'src/scss/modal.scss';
import 'src/scss/react-table.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { MoveListsCtrProvider } from 'src/screens/movelists_container/movelists_container_provider';
import { MovesCtrProvider } from 'src/screens/moves_container/moves_container_provider';
import { AppFrame } from 'src/screens/containers/appframe';
import { SessionCtrProvider } from 'src/screens/session_container/session_container_provider';
import { configureStore } from 'src/app/store';
import { UrlRouter } from 'src/screens/containers/urlrouter';

configureStore();

ReactDOM.render(
  <SessionCtrProvider>
    <MoveListsCtrProvider>
      <MovesCtrProvider>
        <AppFrame>
          <UrlRouter />
        </AppFrame>
      </MovesCtrProvider>
    </MoveListsCtrProvider>
  </SessionCtrProvider>,
  document.getElementById('root')
);
