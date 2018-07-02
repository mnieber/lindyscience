import React from 'react'
import ReactDOM from 'react-dom'
import { getStore } from 'jsx/store'
import { Provider } from 'react-redux';
import * as actions from 'jsx/actions'
import VideoLinks from 'jsx/containers/videolinks'
import {toCamelCase} from 'jsx/utils'

export function render(rootElement, data_str) {
  ReactDOM.render(
    <Provider store={getStore()}>
      <Moves items={toCamelCase(JSON.parse(data_str))}/>
    </Provider>
    , rootElement
  );
}