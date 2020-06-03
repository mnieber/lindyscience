// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import type { TipsByIdT, TipT } from "tips/types";
import type { VoteByIdT, VoteT } from "votes/types";
import type { MoveT } from "moves/types";
import type { UserProfileT } from "profiles/types";
import { mergeDefaultProps, withDefaultProps } from "mergeDefaultProps";
import Ctr from "screens/containers/index";
import { actCastVote } from "votes/actions";
import { actAddTips, actRemoveTips } from "tips/actions";
import Widgets from "screens/presentation/index";
import { getId, createErrorHandler } from "app/utils";
import { listToItemById } from "utils/utils";
import { apiSaveTip, apiDeleteTip } from "tips/api";
import { apiVoteTip } from "votes/api";
import type { UUID } from "kernel/types";

type PropsT = {
  tipsByMoveId: TipsByIdT,
  voteByObjectId: VoteByIdT,
  dispatch: Function,
  defaultProps: any,
} & {
  // default props
  move: MoveT,
};

// $FlowFixMe
export const withTipsPanel = compose(
  Ctr.connect(state => ({
    tipsByMoveId: Ctr.fromStore.getTipsByMoveId(state),
    voteByObjectId: Ctr.fromStore.getVoteByObjectId(state),
  })),
  withDefaultProps,
  observer,
  (WrappedComponent: any) => (p: PropsT) => {
    const props = mergeDefaultProps(p);

    const { tipsByMoveId, voteByObjectId, ...passThroughProps }: PropsT = props;

    const saveTip = (tip: TipT) => {
      props.dispatch(actAddTips(listToItemById([tip])));
      apiSaveTip(props.move.id, tip).catch(
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
        parentObject={props.move}
        tips={props.tipsByMoveId[getId(props.move)] || []}
        voteByObjectId={props.voteByObjectId}
        saveTip={saveTip}
        deleteTip={deleteTip}
        voteTip={voteTip}
        defaultProps={props.defaultProps}
      />
    );

    return <WrappedComponent tipsPanel={tipsPanel} {...passThroughProps} />;
  }
);
