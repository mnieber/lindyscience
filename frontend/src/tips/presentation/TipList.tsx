import React from 'react';
import { observer } from 'mobx-react';

import { MoveT } from 'src/moves/types';
import { Addition } from 'facility-mobx/facets/Addition';
import { Editing } from 'facility-mobx/facets/Editing';
import { TipT } from 'src/tips/types';
import { Tip } from 'src/tips/presentation/Tip';
import { useDefaultProps, FC } from 'react-default-props-context';
import { useStore } from 'src/app/components/StoreProvider';

type PropsT = {};

type DefaultPropsT = {
  tipsAddition: Addition;
  tipsEditing: Editing;
  tips: TipT[];
  move: MoveT;
};

export const TipList: FC<PropsT, DefaultPropsT> = observer((p: any) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);
  const { profilingStore } = useStore();

  const itemNodes: Array<any> = props.tips.map((tip: TipT, idx: number) => {
    const allowEdit =
      !!profilingStore.userProfile &&
      tip.ownerId === profilingStore.userProfile.userId;
    const allowDelete =
      allowEdit ||
      (!!profilingStore.userProfile &&
        props.move.ownerId === profilingStore.userProfile.userId);

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
