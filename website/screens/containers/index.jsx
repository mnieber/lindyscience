// @flow

import * as React from "react";

import { connect } from "react-redux";

import * as screensActions from "screens/actions";
import * as votesActions from "votes/actions";
import * as profilesActions from "profiles/actions";
import * as videoLinksActions from "videolinks/actions";
import * as tipsActions from "tips/actions";

import * as fromMovesStore from "screens/reducers";
import * as fromVotesStore from "votes/reducers";
import * as fromProfilesStore from "profiles/reducers";
import * as fromVideoLinksStore from "videolinks/reducers";
import * as fromTipsStore from "tips/reducers";

import * as screensApi from "screens/api";
import * as votesApi from "votes/api";
import * as profilesApi from "profiles/api";
import * as videoLinksApi from "videolinks/api";
import * as tipsApi from "tips/api";

export type ContainerT = {
  connect: Function,
  actions: any,
  api: any,
  fromStore: any,
};

const Container: ContainerT = {
  connect: connect,
  actions: {
    ...screensActions,
    ...votesActions,
    ...profilesActions,
    ...videoLinksActions,
    ...tipsActions,
  },
  api: {
    ...screensApi,
    ...votesApi,
    ...profilesApi,
    ...videoLinksApi,
    ...tipsApi,
  },
  fromStore: {
    ...fromMovesStore,
    ...fromVotesStore,
    ...fromProfilesStore,
    ...fromVideoLinksStore,
    ...fromTipsStore,
  },
};

export default Container;
