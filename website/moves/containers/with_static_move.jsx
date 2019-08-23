// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "moves/containers/index";

import { getId } from "app/utils";

import Widgets from "moves/presentation/index";
import { withMovePrivateDataPanel } from "moves/containers/with_move_private_data_panel";

import type { MoveT, TipsByIdT, VideoLinksByIdT, MoveListT } from "moves/types";
import type { VoteByIdT } from "votes/types";
import type { TagT } from "profiles/types";

type PropsT = {
  move: MoveT,
  moveList: MoveListT,
  moveTags: Array<TagT>,
  tipsByMoveId: TipsByIdT,
  voteByObjectId: VoteByIdT,
  videoLinksByMoveId: VideoLinksByIdT,
  movePrivateDataPanel: any,
  // receive any actions as well
};

// $FlowFixMe
export const withStaticMove = compose(
  withMovePrivateDataPanel,
  Ctr.connect(
    state => ({
      move: Ctr.fromStore.getHighlightedMove(state),
      moveList: Ctr.fromStore.getSelectedMoveList(state),
      moveTags: Ctr.fromStore.getMoveTags(state),
      tipsByMoveId: Ctr.fromStore.getTipsByMoveId(state),
      voteByObjectId: Ctr.fromStore.getVoteByObjectId(state),
      videoLinksByMoveId: Ctr.fromStore.getVideoLinksByMoveId(state),
    }),
    Ctr.actions
  ),
  (WrappedComponent: any) => (props: any) => {
    const {
      move,
      moveList,
      moveTags,
      tipsByMoveId,
      voteByObjectId,
      videoLinksByMoveId,
      movePrivateDataPanel,
      ...passThroughProps
    }: PropsT = props;

    const actions: any = props;

    const tipsPanel = (
      <Widgets.StaticTipsPanel
        tips={tipsByMoveId[getId(move)]}
        voteByObjectId={voteByObjectId}
      />
    );

    const videoLinksPanel = (
      <Widgets.StaticVideoLinksPanel
        videoLinks={videoLinksByMoveId[getId(move)]}
        voteByObjectId={voteByObjectId}
      />
    );

    const hostedPanels = (
      <React.Fragment>
        {movePrivateDataPanel}
        {tipsPanel}
        {videoLinksPanel}
      </React.Fragment>
    );

    const staticMove = (
      <Widgets.Move
        move={move}
        moveList={moveList}
        key={getId(move)}
        moveTags={moveTags}
        videoLinks={videoLinksByMoveId[getId(move)]}
        hostedPanels={hostedPanels}
      />
    );

    return <WrappedComponent staticMove={staticMove} {...passThroughProps} />;
  }
);
