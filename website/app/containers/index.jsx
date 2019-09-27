// @flow

import * as React from "react";

import { connect } from "react-redux";

import * as fromAppStore from "app/reducers";
import * as appApi from "app/api";

export type ContainerT = {
  connect: Function,
  api: any,
  fromStore: any,
};

const Container: ContainerT = {
  connect: connect,
  actions: {},
  api: {
    ...appApi,
  },
  fromStore: {
    ...fromAppStore,
  },
};

export default Container;
