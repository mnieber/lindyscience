// @flow

import * as React from "react";

import { connect } from "react-redux";

import * as movesActions from "moves/actions";
import * as votesActions from "votes/actions";
import * as profilesActions from "profiles/actions";

import * as fromMovesStore from "moves/reducers";
import * as fromVotesStore from "votes/reducers";
import * as fromProfilesStore from "profiles/reducers";

import * as movesApi from "moves/api";
import * as votesApi from "votes/api";
import * as profilesApi from "profiles/api";

export type ContainerT = {
  connect: Function,
  actions: any,
  api: any,
  fromStore: any,
};

const Container: ContainerT = {
  connect: connect,
  actions: {
    ...movesActions,
    ...votesActions,
    ...profilesActions,
  },
  api: {
    ...movesApi,
    ...votesApi,
    ...profilesApi,
  }
  fromStore: {
    ...fromMovesStore,
    ...fromVotesStore,
    ...fromProfilesStore,
  }
};

export default Container;
