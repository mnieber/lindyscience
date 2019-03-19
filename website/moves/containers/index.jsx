// @flow

import * as React from "react";

import { connect } from "react-redux";
import * as movesActions from "moves/actions";
import * as fromMovesStore from "moves/reducers";
import * as api from "moves/api";

export type ContainerT = {
  connect: Function,
  actions: any,
  api: any,
  fromStore: any,
};

const Container: ContainerT = {
  connect: connect,
  actions: movesActions,
  api: api,
  fromStore: fromMovesStore,
};

export default Container;