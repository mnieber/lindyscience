// @flow

import * as React from "react";
import { compose } from "redux";

import MovesCtr from "moves/containers/index";
import AppCtr from "app/containers/index";
import VotesCtr from "votes/containers/index";
import ProfilesCtr from "profiles/containers/index";

import Widgets from "moves/presentation/index";

import { getId, createErrorHandler } from "app/utils";
import { querySetListToDict } from "utils/utils";

import type { MoveT, TipT } from "moves/types";
import type { UUID } from "app/types";
import type { VoteT } from "votes/types";

type PropsT = {
  move: MoveT,
  // receive any actions as well
};

// $FlowFixMe
export const withTipsPanel = compose(
  MovesCtr.connect(
    state => ({
      move: MovesCtr.fromStore.getHighlightedMove(state),
      userProfile: ProfilesCtr.fromStore.getUserProfile(state),
      tipsByMoveId: MovesCtr.fromStore.getTipsByMoveId(state),
      voteByObjectId: VotesCtr.fromStore.getVoteByObjectId(state),
    }),
    {
      ...AppCtr.actions,
      ...MovesCtr.actions,
      ...VotesCtr.actions,
      ...ProfilesCtr.actions,
    }
  ),
  (WrappedComponent: any) => (props: any) => {
    const {
      move,
      userProfile,
      videoLinksByMoveId,
      voteByObjectId,
      ...passThroughProps
    }: PropsT = props;

    const actions: any = props;

    const saveTip = (tip: TipT) => {
      actions.actAddTips(querySetListToDict([tip]));
      MovesCtr.api
        .saveTip(move.id, tip)
        .catch(createErrorHandler("We could not save the tip"));
    };

    const deleteTip = (tip: TipT) => {
      actions.actRemoveTips([tip.id]);
      MovesCtr.api
        .deleteTip(tip.id)
        .catch(createErrorHandler("We could not delete the tip"));
    };

    const voteTip = (id: UUID, vote: VoteT) => {
      actions.actCastVote(id, vote);
      AppCtr.api
        .voteTip(id, vote)
        .catch(createErrorHandler("We could not save your vote"));
    };

    const tipsPanel = (
      <Widgets.TipsPanel
        move={move}
        userProfile={props.userProfile}
        tips={props.tipsByMoveId[getId(move)]}
        voteByObjectId={props.voteByObjectId}
        saveTip={saveTip}
        deleteTip={deleteTip}
        voteTip={voteTip}
      />
    );

    return <WrappedComponent tipsPanel={tipsPanel} {...passThroughProps} />;
  }
);
