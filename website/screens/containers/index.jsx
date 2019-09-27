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

import * as appApi from "app/api";
import * as screensApi from "screens/api";
import * as votesApi from "votes/api";
import * as profilesApi from "profiles/api";
import * as tipsApi from "tips/api";
import * as movesApi from "moves/api";
import * as tagsApi from "tags/api";
import * as moveListsApi from "move_lists/api";

export type ContainerT = {
  connect: Function,
  api: any,
  fromStore: any,
};

export function browseToMoveUrl(
  moveUrlParts: Array<string>,
  mustUpdateProfile: boolean = true
) {
  const moveUrl = moveUrlParts.filter(x => !!x).join("/");
  if (mustUpdateProfile) {
    profilesApi.updateProfile(moveUrl);
  }
  return navigate(`/app/lists/${moveUrl}`);
}

const Container: ContainerT = {
  connect: connect,
  actions: {},
  api: {
    ...appApi,
    ...screensApi,
    ...votesApi,
    ...profilesApi,
    ...tipsApi,
    ...movesApi,
    ...tagsApi,
    ...moveListsApi,
  },
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
