import React from 'react';

import type { UserProfileT } from 'src/profiles/types';
import type { OwnedObjectT, UUID } from 'src/kernel/types';
import type { TipT } from 'src/tips/types';
import type { VoteByIdT, VoteT } from 'src/votes/types';
import { Tip } from 'src/tips/presentation/tip';

type TipListPropsT = {
  userProfile: ?UserProfileT,
  parentObject: OwnedObjectT,
  items: Array<TipT>,
  voteByObjectId: VoteByIdT,
  setVote: (UUID, VoteT) => void,
  saveTip: Function,
  deleteTip: Function,
  cancelEditTip: Function,
};

export function TipList(props: TipListPropsT) {
  const itemNodes: Array<React.Node> = props.items.map((item, idx) => {
    const allowEdit =
      !!props.userProfile && item.ownerId == props.userProfile.userId;
    const allowDelete =
      allowEdit ||
      (!!props.userProfile &&
        props.parentObject.ownerId == props.userProfile.userId);

    return (
      <Tip
        key={item.id}
        item={item}
        allowEdit={allowEdit}
        allowDelete={allowDelete}
        vote={props.voteByObjectId[item.id] || 0}
        setVote={props.setVote}
        saveTip={props.saveTip}
        deleteTip={props.deleteTip}
        cancelEditTip={props.cancelEditTip}
      />
    );
  });

  return itemNodes;
}
