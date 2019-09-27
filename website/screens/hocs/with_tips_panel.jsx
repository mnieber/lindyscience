// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "screens/containers/index";
import { actCastVote } from "votes/actions";
import { actAddTips, actRemoveTips } from "tips/actions";
import Widgets from "screens/presentation/index";
import { getId, createErrorHandler } from "app/utils";
import { querySetListToDict } from "utils/utils";
import type { MoveT } from "moves/types";
import type { TipT } from "tips/types";
import type { UUID } from "kernel/types";
import type { VoteT } from "votes/types";
import type { UserProfileT } from "profiles/types";

type PropsT = {
  userProfile: UserProfileT,
  // receive any actions as well
};

// $FlowFixMe
export const withTipsPanel = getMove =>
  compose(
    Ctr.connect(state => ({
      userProfile: Ctr.fromStore.getUserProfile(state),
      tipsByMoveId: Ctr.fromStore.getTipsByMoveId(state),
      voteByObjectId: Ctr.fromStore.getVoteByObjectId(state),
    })),
    (WrappedComponent: any) => (props: any) => {
      const {
        userProfile,
        tipsByMoveId,
        voteByObjectId,
        ...passThroughProps
      }: PropsT = props;
      const move: MoveT = getMove();

      const saveTip = (tip: TipT) => {
        props.dispatch(actAddTips(querySetListToDict([tip])));
        Ctr.api
          .saveTip(move.id, tip)
          .catch(createErrorHandler("We could not save the tip"));
      };

      const deleteTip = (tip: TipT) => {
        props.dispatch(actRemoveTips([tip.id]));
        Ctr.api
          .deleteTip(tip.id)
          .catch(createErrorHandler("We could not delete the tip"));
      };

      const voteTip = (id: UUID, vote: VoteT) => {
        props.dispatch(actCastVote(id, vote));
        Ctr.api
          .voteTip(id, vote)
          .catch(createErrorHandler("We could not save your vote"));
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
