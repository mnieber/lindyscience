// @flow

import * as React from 'react'

import { connect } from 'react-redux'
import * as appActions from 'app/actions'
import * as fromAppStore from 'app/reducers'
import * as fromRootReducer from 'app/root_reducer'
import * as appApi from 'app/api'

export type ContainerT = {
  connect: Function,
  actions: any,
  api: any,
  fromStore: any,
};

const Container: ContainerT = {
  connect: connect,
  actions: appActions,
  api: appApi,
  fromStore: {
    ...fromAppStore,
    ...fromRootReducer,
  }
};

export default Container;
