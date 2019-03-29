// @flow

import * as React from "react";

import { connect } from "react-redux";
import { navigate } from "@reach/router";
import * as appActions from "app/actions";
import * as fromAppStore from "app/reducers";
import * as fromRootReducer from "app/root_reducer";
import * as api from "app/api";

export function browseToMove(
  moveUrlParts: Array<string>,
  mustUpdateProfile: boolean = true
) {
  const moveUrl = moveUrlParts.filter(x => !!x).join("/");
  if (mustUpdateProfile) {
    api.updateProfile(moveUrl);
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
  actions: appActions,
  api: api,
  fromStore: {
    ...fromAppStore,
    ...fromRootReducer,
  },
  browseToMove,
};

export default Container;
