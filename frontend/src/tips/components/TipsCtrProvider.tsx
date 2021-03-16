import * as React from 'react';

import { MoveT } from 'src/moves/types';
import { TipsCtr } from 'src/tips/TipsCtr';
import { reaction } from 'mobx';
import { useDefaultProps, FC, CtrProvider } from 'react-default-props-context';
import { useStore } from 'src/app/components/StoreProvider';

type PropsT = React.PropsWithChildren<{
  ctrKey?: string;
}>;

type DefaultPropsT = {
  move: MoveT;
};

// Note: don't observe this with MobX
export const TipsCtrProvider: FC<PropsT, DefaultPropsT> = (p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);
  const { profilingStore, tipsStore } = useStore();
  const createCtr = () => {
    return new TipsCtr({ tipsStore: tipsStore });
  };

  const updateCtr = (ctr: TipsCtr) =>
    reaction(
      () => ({
        move: props.move,
        tips: tipsStore.tipsByMoveId[props.move?.id] ?? [],
        userProfile: profilingStore.userProfile,
      }),
      ({ move, tips, userProfile }) => {
        ctr.inputs.move = move;
        ctr.inputs.tips = tips;
        ctr.inputs.userProfile = userProfile;
      },
      {
        fireImmediately: true,
      }
    );

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
      destroyCtr={(ctr) => ctr.destroy()}
      updateCtr={updateCtr}
      getDefaultProps={getDefaultProps}
      children={props.children}
    />
  );
};
