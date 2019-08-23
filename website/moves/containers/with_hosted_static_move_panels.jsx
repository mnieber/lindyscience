// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "moves/containers/index";

import Widgets from "moves/presentation/index";

import { getId } from "app/utils";

import { withMovePrivateDataPanel } from "moves/containers/with_move_private_data_panel";
import { withVideoLinksPanel } from "moves/containers/with_videolinks_panel";
import { withTipsPanel } from "moves/containers/with_tips_panel";

import type { MoveT, TipsByIdT, VideoLinksByIdT } from "moves/types";
import type { VoteByIdT } from "votes/types";

type PropsT = {
  move: MoveT,
  tipsByMoveId: TipsByIdT,
  voteByObjectId: VoteByIdT,
  videoLinksByMoveId: VideoLinksByIdT,
  movePrivateDataPanel: any,
  // receive any actions as well
};

// $FlowFixMe
export const withHostedStaticMovePanels = compose(
  withMovePrivateDataPanel,
  Ctr.connect(
    state => ({
      move: Ctr.fromStore.getHighlightedMove(state),
      voteByObjectId: Ctr.fromStore.getVoteByObjectId(state),
      tipsByMoveId: Ctr.fromStore.getTipsByMoveId(state),
      videoLinksByMoveId: Ctr.fromStore.getVideoLinksByMoveId(state),
    }),
    Ctr.actions
  ),
  (WrappedComponent: any) => (props: any) => {
    const {
      move,
      tipsByMoveId,
      voteByObjectId,
      videoLinksByMoveId,
      movePrivateDataPanel,
      ...passThroughProps
    }: PropsT = props;

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

    const hostedStaticMovePanels = (
      <React.Fragment>
        {movePrivateDataPanel}
        {tipsPanel}
        {videoLinksPanel}
      </React.Fragment>
    );

    return (
      <WrappedComponent
        hostedStaticMovePanels={hostedStaticMovePanels}
        {...passThroughProps}
      />
    );
  }
);
