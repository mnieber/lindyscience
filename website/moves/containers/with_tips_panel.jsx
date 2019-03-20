// @flow

import * as React from "react";
import { compose } from "redux";

import MovesCtr from "moves/containers/index";
import AppCtr from "app/containers/index";

import Widgets from "moves/presentation/index";

// $FlowFixMe
import uuidv4 from "uuid/v4";
import { getId, createErrorHandler } from "app/utils";
import { querySetListToDict } from "utils/utils";

import type { MoveT, TipT, TipsByIdT } from "moves/types";
import type { UUID, VoteT, UserProfileT, VoteByIdT } from "app/types";

type PropsT = {
  move: MoveT,
  // receive any actions as well
};

// $FlowFixMe
export const withTipsPanel = compose(
  MovesCtr.connect(
    state => ({
      move: MovesCtr.fromStore.getHighlightedMove(state),
      userProfile: AppCtr.fromStore.getUserProfile(state),
      tipsByMoveId: MovesCtr.fromStore.getTipsByMoveId(state),
      voteByObjectId: AppCtr.fromStore.getVoteByObjectId(state),
    }),
    {
      ...AppCtr.actions,
      ...MovesCtr.actions,
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
      let response = MovesCtr.api.saveTip(move.id, tip);
      response.catch(createErrorHandler("We could not save the tip"));
    };

    const voteTip = (id: UUID, vote: VoteT) => {
      actions.actCastVote(id, vote);
      AppCtr.api
        .voteTip(id, vote)
        .catch(createErrorHandler("We could not save your vote"));
    };

    const tipsPanel = (
      <Widgets.TipsPanel
        moveId={getId(move)}
        userProfile={props.userProfile}
        tips={props.tipsByMoveId[getId(move)]}
        voteByObjectId={props.voteByObjectId}
        saveTip={saveTip}
        voteTip={voteTip}
      />
    );

    return <WrappedComponent tipsPanel={tipsPanel} {...passThroughProps} />;
  }
);