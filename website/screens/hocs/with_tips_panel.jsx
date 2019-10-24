// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import { MovesContainer } from "screens/moves_container/moves_container";
import Ctr from "screens/containers/index";
import { actCastVote } from "votes/actions";
import { actAddTips, actRemoveTips } from "tips/actions";
import Widgets from "screens/presentation/index";
import { getId, createErrorHandler } from "app/utils";
import { listToItemById } from "utils/utils";
import { apiSaveTip, apiDeleteTip } from "tips/api";
import { apiVoteTip } from "votes/api";
import type { TipT } from "tips/types";
import type { UUID } from "kernel/types";
import type { VoteT } from "votes/types";
import type { UserProfileT } from "profiles/types";

type PropsT = {
  userProfile: UserProfileT,
  movesCtr: MovesContainer,
};

// $FlowFixMe
export const withTipsPanel = compose(
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
    tipsByMoveId: Ctr.fromStore.getTipsByMoveId(state),
    voteByObjectId: Ctr.fromStore.getVoteByObjectId(state),
  })),
  observer,
  (WrappedComponent: any) => (props: any) => {
    const {
      userProfile,
      tipsByMoveId,
      voteByObjectId,
      ...passThroughProps
    }: PropsT = props;

    const move = props.movesCtr.highlight.item;

    const saveTip = (tip: TipT) => {
      props.dispatch(actAddTips(listToItemById([tip])));
      apiSaveTip(move.id, tip).catch(
        createErrorHandler("We could not save the tip")
      );
    };

    const deleteTip = (tip: TipT) => {
      props.dispatch(actRemoveTips([tip.id]));
      apiDeleteTip(tip.id).catch(
        createErrorHandler("We could not delete the tip")
      );
    };

    const voteTip = (id: UUID, vote: VoteT) => {
      props.dispatch(actCastVote(id, vote));
      apiVoteTip(id, vote).catch(
        createErrorHandler("We could not save your vote")
      );
    };

    const tipsPanel = (
      <Widgets.TipsPanel
        parentObject={move}
        userProfile={props.userProfile}
        tips={props.tipsByMoveId[getId(move)] || []}
        voteByObjectId={props.voteByObjectId}
        saveTip={saveTip}
        deleteTip={deleteTip}
        voteTip={voteTip}
      />
    );

    return <WrappedComponent tipsPanel={tipsPanel} {...passThroughProps} />;
  }
);
