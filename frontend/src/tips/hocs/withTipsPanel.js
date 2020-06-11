// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';

import { TipsPanel } from 'src/tips/presentation/TipsPanel';
import { mergeDefaultProps, withDefaultProps } from 'src/npm/mergeDefaultProps';
import type { MoveT } from 'src/moves/types';
import { TipsStore } from 'src/tips/TipsStore';
import { VotesStore } from 'src/votes/VotesStore';
import type { TipT } from 'src/tips/types';
import type { UUID } from 'src/kernel/types';
import type { VoteT } from 'src/votes/types';
import { createErrorHandler, getId } from 'src/app/utils';
import { apiDeleteTip, apiSaveTip } from 'src/tips/api';
import { apiVoteTip } from 'src/votes/api';

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
      <TipsPanel
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
