// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "moves/containers/index";

import { getId } from "app/utils";
import { getStore } from "app/store";

import Widgets from "moves/presentation/index";
import { withHostedStaticMovePanels } from "moves/containers/with_hosted_static_move_panels";

import type { VideoLinksByIdT } from "moves/types";
import type { MoveT, MoveListT } from "moves/types";
import type { TagT } from "profiles/types";

type PropsT = {
  move: MoveT,
  moveList: MoveListT,
  moveTags: Array<TagT>,
  videoLinksByMoveId: VideoLinksByIdT,
  hostedStaticMovePanels: any,
  // receive any actions as well
};

function getMoveId() {
  const state = getStore().getState();
  return getId(Ctr.fromStore.getHighlightedMove(state));
}

// $FlowFixMe
export const withStaticMove = compose(
  withHostedStaticMovePanels(getMoveId),
  Ctr.connect(
    state => ({
      move: Ctr.fromStore.getHighlightedMove(state),
      moveList: Ctr.fromStore.getSelectedMoveList(state),
      moveTags: Ctr.fromStore.getMoveTags(state),
      videoLinksByMoveId: Ctr.fromStore.getVideoLinksByMoveId(state),
    }),
    Ctr.actions
  ),
  (WrappedComponent: any) => (props: any) => {
    const {
      move,
      moveList,
      moveTags,
      videoLinksByMoveId,
      hostedStaticMovePanels,
      ...passThroughProps
    }: PropsT = props;

    const actions: any = props;

    const staticMove = (
      <Widgets.Move
        move={move}
        moveList={moveList}
        key={getId(move)}
        moveTags={moveTags}
        videoLinks={videoLinksByMoveId[getId(move)]}
        hostedPanels={hostedStaticMovePanels}
      />
    );

    return <WrappedComponent staticMove={staticMove} {...passThroughProps} />;
  }
);
