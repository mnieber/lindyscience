import { compose } from 'lodash/fp';
import * as React from 'react';
import { observer } from 'mobx-react';

import { TipsPanel } from 'src/tips/presentation/TipsPanel';
import {
  mergeDefaultProps,
  withDefaultProps,
} from 'react-default-props-context';
import { MoveT } from 'src/moves/types';
import { TipsStore } from 'src/tips/TipsStore';
import { VotesStore } from 'src/votes/VotesStore';
import { TipT } from 'src/tips/types';
import { UUID } from 'src/kernel/types';
import { VoteT } from 'src/votes/types';
import { createErrorHandler, getId } from 'src/app/utils';
import { apiDeleteTip, apiSaveTip } from 'src/tips/api';

type PropsT = {
  defaultProps?: any;
};

type DefaultPropsT = {
  move: MoveT;
  tipsStore: TipsStore;
  votesStore: VotesStore;
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

    return <WrappedComponent tipsPanel={tipsPanel} {...p} />;
  }
);
