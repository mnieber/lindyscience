// @flow

import * as React from "react";

import { connect } from "react-redux";
import * as votesActions from "votes/actions";
import * as fromVotesStore from "votes/reducers";
import * as api from "votes/api";

export type ContainerT = {
  connect: Function,
  api: any,
  fromStore: any,
};

const Container: ContainerT = {
  connect: connect,
  actions: votesActions,
  api: api,
  fromStore: fromVotesStore,
};

export default Container;
