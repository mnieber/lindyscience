// @flow

import * as React from "react";
import { compose } from "redux";

import MovesCtr from "moves/containers/index";
import AppCtr from "app/containers/index";
import VotesCtr from "votes/containers/index";

import { getId } from "app/utils";

import Widgets from "moves/presentation/index";
import { withMovePrivateDataPanel } from "moves/containers/with_move_private_data_panel";

import type { MoveT, TipsByIdT, VideoLinksByIdT, MoveListT } from "moves/types";
import type { VoteByIdT } from "votes/types";
import type { TagT } from "app/types";

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
  MovesCtr.connect(
    state => ({
      move: MovesCtr.fromStore.getHighlightedMove(state),
      moveList: MovesCtr.fromStore.getSelectedMoveList(state),
      moveTags: MovesCtr.fromStore.getMoveTags(state),
      tipsByMoveId: MovesCtr.fromStore.getTipsByMoveId(state),
      voteByObjectId: VotesCtr.fromStore.getVoteByObjectId(state),
      videoLinksByMoveId: MovesCtr.fromStore.getVideoLinksByMoveId(state),
    }),
    {
      ...AppCtr.actions,
      ...MovesCtr.actions,
      ...VotesCtr.actions,
    }
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

    const staticMove = (
      <Widgets.Move
        move={move}
        moveList={moveList}
        key={getId(move)}
        moveTags={moveTags}
        tipsPanel={tipsPanel}
        videoLinksPanel={videoLinksPanel}
        videoLinks={videoLinksByMoveId[getId(move)]}
        movePrivateDataPanel={movePrivateDataPanel}
      />
    );

    return <WrappedComponent staticMove={staticMove} {...passThroughProps} />;
  }
);
