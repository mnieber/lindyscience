import React from 'react'
import ReactDOM from 'react-dom'
import { getStore } from 'jsx/store'
import { Provider } from 'react-redux';
import * as actions from 'jsx/actions'
import VideoLinks from 'jsx/containers/videolinks'
import {toCamelCase} from 'jsx/utils'

export function render(rootElement, dataStr, moveName) {
  ReactDOM.render(
    <Provider store={getStore()}>
      <VideoLinks moveName={moveName} items={toCamelCase(JSON.parse(dataStr))}/>
    </Provider>
    , rootElement
  );
}