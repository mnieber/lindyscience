// @flow

import * as React from "react";

import { connect } from "react-redux";
import { navigate } from "@reach/router";
import { bindActionCreators } from "redux";

import * as fromAppStore from "app/reducers";
import * as fromScreensStore from "screens/reducers";
import * as fromVotesStore from "votes/reducers";
import * as fromProfilesStore from "profiles/reducers";
import * as fromTipsStore from "tips/reducers";
import * as fromMovesStore from "moves/reducers";
import * as fromMoveListsStore from "move_lists/reducers";
import * as fromVideoStore from "video/reducers";

import { apiUpdateProfile } from "profiles/api";

export type ContainerT = {
  connect: Function,
  fromStore: any,
};

export function browseToMoveUrl(
  moveUrlParts: Array<string>,
  mustUpdateProfile: boolean = true
) {
  const moveUrl = moveUrlParts.filter(x => !!x).join("/");
  if (mustUpdateProfile) {
    apiUpdateProfile(moveUrl);
  }
  return navigate(`/app/lists/${moveUrl}`);
}

const Container: ContainerT = {
  connect: connect,
  fromStore: {
    ...fromAppStore,
    ...fromScreensStore,
    ...fromVotesStore,
    ...fromProfilesStore,
    ...fromTipsStore,
    ...fromMovesStore,
    ...fromMoveListsStore,
    ...fromVideoStore,
  },
  browseToMoveUrl,
};

export default Container;
