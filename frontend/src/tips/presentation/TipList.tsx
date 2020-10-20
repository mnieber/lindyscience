import React from 'react';
import { observer } from 'mobx-react';

import { MoveT } from 'src/moves/types';
import { Addition } from 'facet-mobx/facets/addition';
import { Editing } from 'facet-mobx/facets/editing';
import { UserProfileT } from 'src/profiles/types';
import { TipT } from 'src/tips/types';
import { Tip } from 'src/tips/presentation/Tip';
import { useDefaultProps, FC } from 'react-default-props-context';

type PropsT = {};

type DefaultPropsT = {
  userProfile?: UserProfileT;
  tipsAddition: Addition;
  tipsEditing: Editing;
  tips: TipT[];
  move: MoveT;
};

export const TipList: FC<PropsT, DefaultPropsT> = observer((p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);

  const itemNodes: Array<any> = props.tips.map((tip: TipT, idx: number) => {
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
});
