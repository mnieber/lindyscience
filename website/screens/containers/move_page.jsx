// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { SessionContainer } from "screens/session_container/session_container";
import { withSessionCtr } from "screens/session_container/session_container_context";
import { useParams } from "utils/react_router_dom_wrapper";
import { findMoveBySlugid, makeSlugid } from "screens/utils";
import { Highlight } from "facets/generic/highlight";
import { Selection } from "facets/generic/selection";
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
  moveListUrl: string,
  movePrivateDataPanel: any,
  moveDiv: any,
  userProfile: UserProfileT,
  dispatch: Function,
};

function MovePage(props: MovePagePropsT) {
  const params = useParams();

  const moveMatchingUrl = findMoveBySlugid(
    props.movesCtr.data.preview,
    makeSlugid(params.moveSlug, params.moveId)
  );

  // TODO: move to sessionCtr
  React.useEffect(() => {
    if (moveMatchingUrl) {
      Highlight.get(props.movesCtr).id = moveMatchingUrl.id;
      Selection.get(props.movesCtr).selectItem({
        itemId: moveMatchingUrl.id,
        isShift: false,
        isCtrl: false,
      });
    }
  }, [moveMatchingUrl]);

  const move = props.movesCtr.highlight.item;
  const hasLoadedSelectedMoveList = props.sessionCtr.loading.loadedMoveListUrls.includes(
    props.sessionCtr.navigation.selectedMoveListUrl
  );

  const notFoundDiv = <div>Oops, I cannot find this move list</div>;
  const loadingDiv = <div>Loading move list, please wait...</div>;

  const isMoveListNotFound = props.sessionCtr.loading.notFoundMoveListUrls.includes(
    props.moveListUrl
  );

  if (!move) {
    const msg = hasLoadedSelectedMoveList
      ? "Oops, I cannot find this move"
      : "Loading, please wait...";

    return <div className="noMoveHighlighted">{msg}</div>;
  }

  const moveList = props.moveListsCtr.highlight.item;

  if (!moveList && isMoveListNotFound) {
    return notFoundDiv;
  }

  if (!moveList && !isMoveListNotFound) {
    return loadingDiv;
  }

  return props.moveDiv;
}

// $FlowFixMe
MovePage = compose(
  withSessionCtr,
  withMovesCtr,
  withMoveVideoBvr,
  withMove,
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
    moveListUrl: Ctr.fromStore.getSelectedMoveListUrl(state),
  })),
  observer
)(MovePage);

export default MovePage;
