// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "screens/containers/index";

import Widgets from "screens/presentation/index";

import { getId } from "app/utils";

import { withMovePrivateDataPanel } from "screens/hocs/with_move_private_data_panel";

import type { VideoLinksByIdT } from "videolinks/types";
import type { TipsByIdT } from "tips/types";
import type { MoveT } from "moves/types";
import type { VoteByIdT } from "votes/types";
import type { UserProfileT } from "profiles/types";

type PropsT = {
  userProfile: UserProfileT,
  tipsByMoveId: TipsByIdT,
  voteByObjectId: VoteByIdT,
  videoLinksByMoveId: VideoLinksByIdT,
  movePrivateDataPanel: any,
  // receive any actions as well
};

// $FlowFixMe
export const withHostedStaticMovePanels = getMove =>
  compose(
    withMovePrivateDataPanel(getMove),
    Ctr.connect(
      state => ({
        userProfile: Ctr.fromStore.getUserProfile(state),
        voteByObjectId: Ctr.fromStore.getVoteByObjectId(state),
        tipsByMoveId: Ctr.fromStore.getTipsByMoveId(state),
        videoLinksByMoveId: Ctr.fromStore.getVideoLinksByMoveId(state),
      }),
      Ctr.actions
    ),
    (WrappedComponent: any) => (props: any) => {
      const {
        userProfile,
        tipsByMoveId,
        voteByObjectId,
        videoLinksByMoveId,
        movePrivateDataPanel,
        ...passThroughProps
      }: PropsT = props;

      const tipsPanel = (
        <Widgets.StaticTipsPanel
          tips={tipsByMoveId[getId(getMove())] || []}
          voteByObjectId={voteByObjectId}
        />
      );

      const videoLinksPanel = (
        <Widgets.StaticVideoLinksPanel
          videoLinks={videoLinksByMoveId[getId(getMove())] || []}
          voteByObjectId={voteByObjectId}
        />
      );

      const hostedStaticMovePanels = (
        <React.Fragment>
          {userProfile && movePrivateDataPanel}
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
