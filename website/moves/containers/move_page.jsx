// @flow

import * as React from "react";
import { compose } from "redux";
import MovesCtr from "moves/containers/index";
import AppCtr from "app/containers/index";

import Widgets from "moves/presentation/index";
import { withMovePrivateDataPanel } from "moves/containers/with_move_private_data_panel";
import { withStaticMove } from "moves/containers/with_static_move";
import { withOwnMove } from "moves/containers/with_own_move";
import { withMoveCrudBvrsContext } from "moves/containers/move_crud_behaviours";

// $FlowFixMe
import uuidv4 from "uuid/v4";
import { newMoveSlug } from "moves/utils";
import { isOwner } from "app/utils";

import { MoveCrudBvrsContext } from "moves/containers/move_crud_behaviours";

import type { UUID, UserProfileT, VoteByIdT, TagT, VoteT } from "app/types";
import type {
  MoveT,
  VideoLinksByIdT,
  TipsByIdT,
  MoveCrudBvrsT,
} from "moves/types";

type MovePagePropsT = {
  movePrivateDataPanel: any,
  staticMove: any,
  ownMove: any,
  moveCrudBvrs: MoveCrudBvrsT,
  userProfile: UserProfileT,
  highlightedMove: MoveT,
  actions: any,
  // the follower are inserted by the router
  moveSlug: string,
  moveId: ?UUID,
};

function MovePage(props: MovePagePropsT) {
  const actions: any = props;

  React.useEffect(() => {
    if (
      props.userProfile &&
      props.moveSlug == newMoveSlug &&
      !props.moveCrudBvrs.newMoveBvr.newItem
    ) {
      props.moveCrudBvrs.newMoveBvr.addNewItem();
    }
    actions.actSetHighlightedMoveBySlug(props.moveSlug, props.moveId);
  }, [props.moveSlug, props.moveId, props.userProfile]);

  if (!props.highlightedMove) {
    return (
      <div className="noMoveHighlighted">Oops, I cannot find this move</div>
    );
  }

  return isOwner(props.userProfile, props.highlightedMove.ownerId)
    ? props.ownMove
    : props.staticMove;
}

// $FlowFixMe
MovePage = compose(
  withStaticMove,
  withOwnMove,
  withMoveCrudBvrsContext,
  MovesCtr.connect(
    state => ({
      userProfile: AppCtr.fromStore.getUserProfile(state),
      highlightedMove: MovesCtr.fromStore.getHighlightedMove(state),
    }),
    {
      ...AppCtr.actions,
      ...MovesCtr.actions,
    }
  )
)(MovePage);

export default MovePage;
