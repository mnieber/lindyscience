// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';

import { VotesStore } from 'src/votes/VotesStore';
import { TipsStore } from 'src/tips/TipsStore';
import type { TipsByIdT, TipT } from 'src/tips/types';
import type { VoteByIdT, VoteT } from 'src/votes/types';
import type { MoveT } from 'src/moves/types';
import { mergeDefaultProps, withDefaultProps } from 'src/mergeDefaultProps';
import Widgets from 'src/screens/presentation/index';
import { getId, createErrorHandler } from 'src/app/utils';
import { apiSaveTip, apiDeleteTip } from 'src/tips/api';
import { apiVoteTip } from 'src/votes/api';
import type { UUID } from 'src/kernel/types';

type PropsT = {
  defaultProps?: any,
};

type DefaultPropsT = {
  move: MoveT,
  tipsStore: TipsStore,
  votesStore: VotesStore,
};

export const withTipsPanel = compose(
  withDefaultProps,
  observer,
  (WrappedComponent: any) => (p: PropsT) => {
    const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

    const saveTip = (tip: TipT) => {
      props.tipsStore.addTips({ [tip.id]: tip });
      apiSaveTip(props.move.id, tip).catch(
        createErrorHandler('We could not save the tip')
      );
    };

    const deleteTip = (tip: TipT) => {
      props.tipsStore.removeTips([tip.id]);
      apiDeleteTip(tip.id).catch(
        createErrorHandler('We could not delete the tip')
      );
    };

    const voteTip = (id: UUID, vote: VoteT) => {
      props.votesStore.castVote(id, vote);
      apiVoteTip(id, vote).catch(
        createErrorHandler('We could not save your vote')
      );
    };

    const tipsPanel = (
      <Widgets.TipsPanel
        parentObject={props.move}
        tips={props.tipsStore.tipsByMoveId[getId(props.move)] || []}
        voteByObjectId={props.votesStore.voteByObjectId}
        saveTip={saveTip}
        deleteTip={deleteTip}
        voteTip={voteTip}
        defaultProps={props.defaultProps}
      />
    );

    // $FlowFixMe
    return <WrappedComponent tipsPanel={tipsPanel} {...p} />;
  }
);
