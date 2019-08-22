// @flow

import * as React from "react";

import { connect } from "react-redux";
import { navigate } from "@reach/router";

import * as appActions from "app/actions";
import * as movesActions from "moves/actions";
import * as votesActions from "votes/actions";
import * as profilesActions from "profiles/actions";

import * as appApi from "app/api";
import * as movesApi from "moves/api";
import * as votesApi from "votes/api";
import * as profilesApi from "profiles/api";

import * as fromAppStore from "app/reducers";
import * as fromMovesStore from "moves/reducers";
import * as fromVotesStore from "votes/reducers";
import * as fromProfilesStore from "profiles/reducers";

export function browseToMove(
  moveUrlParts: Array<string>,
  mustUpdateProfile: boolean = true
) {
  const moveUrl = moveUrlParts.filter(x => !!x).join("/");
  if (mustUpdateProfile) {
    profilesApi.updateProfile(moveUrl);
  }
  return navigate(`/app/lists/${moveUrl}`);
}

export type ContainerT = {
  connect: Function,
  actions: any,
  api: any,
  fromStore: any,
};

const Container: ContainerT = {
  connect: connect,
  actions: {
    ...appActions,
    ...movesActions,
    ...votesActions,
    ...profilesActions,
  },
  api: {
    ...appApi,
    ...movesApi,
    ...votesApi,
    ...profilesApi,
  },
  fromStore: {
    ...fromAppStore,
    ...fromMovesStore,
    ...fromVotesStore,
    ...fromProfilesStore,
  },
  browseToMove,
};

export default Container;
