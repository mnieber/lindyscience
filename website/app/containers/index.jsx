// @flow

import * as React from "react";

import { connect } from "react-redux";

import * as fromAppStore from "app/reducers";

export type ContainerT = {
  connect: Function,
  fromStore: any,
};

const Container: ContainerT = {
  connect: connect,
  actions: {},
  fromStore: {
    ...fromAppStore,
  },
};

export default Container;
