// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { SessionContainer } from "screens/session_container/session_container";
import { withSessionCtr } from "screens/session_container/session_container_context";
import { withMovesCtr } from "screens/moves_container/moves_container_context";
import { MovesContainer } from "screens/moves_container/moves_container";
import Ctr from "screens/containers/index";
import { withMove } from "screens/hocs/with_move";
import { withMoveVideoBvr } from "screens/hocs/with_move_video_bvr";
import type { UserProfileT } from "profiles/types";

type MovePagePropsT = {
  sessionCtr: SessionContainer,
  movesCtr: MovesContainer,
  moveListsCtr: MoveListsContainer,
  movePrivateDataPanel: any,
  moveDiv: any,
  userProfile: UserProfileT,
  dispatch: Function,
};

function MovePage(props: MovePagePropsT) {
  const move = props.movesCtr.highlight.item;
  const hasLoadedSelectedMoveList = props.sessionCtr.loading.loadedMoveListUrls.includes(
    props.sessionCtr.navigation.moveListUrl
  );
  const isMoveListNotFound = props.sessionCtr.loading.notFoundMoveListUrls.includes(
    props.sessionCtr.navigation.moveListUrl
  );

  const notFoundDiv = <div>Oops, I cannot find this move list</div>;
  const loadingDiv = <div>Loading move list, please wait...</div>;
  const moveNotFoundMsg = hasLoadedSelectedMoveList
    ? "Oops, I cannot find this move"
    : "Loading, please wait...";
  const moveNotFoundDiv = (
    <div className="noMoveHighlighted">{moveNotFoundMsg}</div>
  );

  const moveList = props.moveListsCtr.highlight.item;
  return !moveList && isMoveListNotFound
    ? notFoundDiv
    : !moveList && !isMoveListNotFound
    ? loadingDiv
    : moveList && !move
    ? moveNotFoundDiv
    : props.moveDiv;
}

// $FlowFixMe
MovePage = compose(
  withSessionCtr,
  withMovesCtr,
  withMoveVideoBvr,
  withMove,
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
  })),
  observer
)(MovePage);

export default MovePage;
