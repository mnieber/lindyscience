// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import { findMoveBySlugid, makeSlugid } from "screens/utils";
import { Highlight } from "screens/data_containers/bvrs/highlight";
import { Selection } from "screens/data_containers/bvrs/selection";
import { withMovesCtr } from "screens/data_containers/moves_container_context";
import { MovesContainer } from "screens/data_containers/moves_container";
import Ctr from "screens/containers/index";
import { withMove } from "screens/hocs/with_move";
import { withMoveVideoBvr } from "screens/hocs/with_move_video_bvr";
import type { UUID } from "kernel/types";
import type { UserProfileT } from "profiles/types";

type MovePagePropsT = {
  movePrivateDataPanel: any,
  moveDiv: any,
  userProfile: UserProfileT,
  hasLoadedSelectedMoveList: boolean,
  dispatch: Function,
  movesCtr: MovesContainer,
  // the follower are inserted by the router
  moveSlugPrm: string,
  moveIdPrm: ?UUID,
};

function MovePage(props: MovePagePropsT) {
  const moveMatchingUrl = findMoveBySlugid(
    props.movesCtr.data.preview,
    makeSlugid(props.moveSlugPrm, props.moveIdPrm)
  );

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
  if (!move) {
    const msg = props.hasLoadedSelectedMoveList
      ? "Oops, I cannot find this move"
      : "Loading, please wait...";

    return <div className="noMoveHighlighted">{msg}</div>;
  }

  return props.moveDiv;
}

// $FlowFixMe
MovePage = compose(
  withMovesCtr,
  withMoveVideoBvr,
  withMove,
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
    hasLoadedSelectedMoveList: Ctr.fromStore.hasLoadedSelectedMoveList(state),
  })),
  observer
)(MovePage);

export default MovePage;
