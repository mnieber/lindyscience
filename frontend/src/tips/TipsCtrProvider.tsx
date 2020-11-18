import * as React from 'react';

import { UserProfileT } from 'src/profiles/types';
import { TipsStore } from 'src/tips/TipsStore';
import { MoveT } from 'src/moves/types';
import { TipsCtr } from 'src/tips/TipsCtr';
import { reaction } from 'src/utils/mobx_wrapper';
import { CtrProvider } from 'src/app/CtrProvider';
import { useDefaultProps, FC } from 'react-default-props-context';

type PropsT = React.PropsWithChildren<{
  ctrKey?: string;
}>;

type DefaultPropsT = {
  move: MoveT;
  userProfile: UserProfileT;
  tipsStore: TipsStore;
};

// Note: don't observe this with MobX
export const TipsCtrProvider: FC<PropsT, DefaultPropsT> = (p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);
  const createCtr = () => {
    return new TipsCtr({ tipsStore: props.tipsStore });
  };

  const updateCtr = (ctr: TipsCtr) => {
    reaction(
      () => ({
        move: props.move,
        tips: props.tipsStore.tipsByMoveId[props.move?.id] ?? [],
        userProfile: props.userProfile,
      }),
      ({ move, tips, userProfile }) => {
        ctr.inputs.move = move;
        ctr.inputs.tips = tips;
        ctr.inputs.userProfile = userProfile;
      }
    );
  };

  const getDefaultProps = (ctr: TipsCtr) => {
    return {
      tips: () => ctr.outputs.display,
      tipsEditing: () => ctr.editing,
      tipsAddition: () => ctr.addition,
      tipsHighlight: () => ctr.highlight,
      tipsDeletion: () => ctr.deletion,
    };
  };

  return (
    <CtrProvider
      ctrKey={props.ctrKey}
      createCtr={createCtr}
      updateCtr={updateCtr}
      getDefaultProps={getDefaultProps}
      children={props.children}
    />
  );
};
