// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import { MovesContainer } from "screens/data_containers/moves_container";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";
import { withMovePrivateDataPanel } from "screens/hocs/with_move_private_data_panel";
import type { TipsByIdT } from "tips/types";
import type { VoteByIdT } from "votes/types";
import type { UserProfileT } from "profiles/types";

type PropsT = {
  userProfile: UserProfileT,
  tipsByMoveId: TipsByIdT,
  voteByObjectId: VoteByIdT,
  movePrivateDataPanel: any,
  movesCtr: MovesContainer,
};

// $FlowFixMe
export const withHostedStaticMovePanels = compose(
  withMovePrivateDataPanel,
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
    voteByObjectId: Ctr.fromStore.getVoteByObjectId(state),
    tipsByMoveId: Ctr.fromStore.getTipsByMoveId(state),
  })),
  observer,
  (WrappedComponent: any) => (props: any) => {
    const {
      userProfile,
      tipsByMoveId,
      voteByObjectId,
      movePrivateDataPanel,
      ...passThroughProps
    }: PropsT = props;

    const moveId = props.movesCtr.highlight.id;

    const tipsPanel = (
      <Widgets.StaticTipsPanel
        tips={tipsByMoveId[moveId] || []}
        voteByObjectId={voteByObjectId}
      />
    );

    const hostedStaticMovePanels = (
      <React.Fragment>
        {userProfile && movePrivateDataPanel}
        {tipsPanel}
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
