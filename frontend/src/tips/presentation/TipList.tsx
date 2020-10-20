import React from 'react';

import { MoveT } from 'src/moves/types';
import { Addition } from 'facet-mobx/facets/addition';
import { Editing } from 'facet-mobx/facets/editing';
import { UserProfileT } from 'src/profiles/types';
import { TipT } from 'src/tips/types';
import { Tip } from 'src/tips/presentation/Tip';
import { mergeDefaultProps } from 'react-default-props-context';

type PropsT = {};

type DefaultPropsT = {
  userProfile?: UserProfileT;
  tipsAddition: Addition;
  tipsEditing: Editing;
  tips: TipT[];
  move: MoveT;
};

export function TipList(p: PropsT) {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  const itemNodes: Array<any> = props.tips.map((tip, idx) => {
    const allowEdit =
      !!props.userProfile && tip.ownerId === props.userProfile.userId;
    const allowDelete =
      allowEdit ||
      (!!props.userProfile && props.move.ownerId === props.userProfile.userId);
    return (
      <Tip
        key={tip.id}
        item={tip}
        allowEdit={allowEdit}
        allowDelete={allowDelete}
      />
    );
  });

  return <div className="TipList">{itemNodes}</div>;
}
