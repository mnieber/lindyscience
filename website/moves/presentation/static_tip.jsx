// @flow

import * as React from 'react'
import { StaticVoteCount } from 'app/presentation/static_vote_count'
import { TipForm } from 'moves/presentation/tip_form'
import { useFlag } from 'utils/hooks'
import type { VoteByIdT, VoteT } from 'app/types'
import type { TipT } from 'moves/types'


// Tip
type StaticTipPropsT = {
  item: TipT,
  vote: VoteT,
};

export function StaticTip(props: StaticTipPropsT) {
  const voteCount =
    <StaticVoteCount
      vote={props.vote}
      count={props.item.voteCount}
    />

  const text =
    <div className='tip__text'>
      {props.item.text}
    </div>;

  return (
    <div className='tip'>
      {voteCount}
      {text}
    </div>
  );
}

// TipList

type StaticTipListPropsT = {
  items: Array<TipT>,
  voteByObjectId: VoteByIdT,
};

export function StaticTipList(props: StaticTipListPropsT) {
  const itemNodes: Array<React.Node> = props.items.map((item, idx) => {
    return (
      <StaticTip
        key={item.id}
        item={item}
        vote={props.voteByObjectId[item.id] || 0}
      />
    );
  })

  return itemNodes;
}