import * as React from 'react';

import { Display as SessionDisplay } from 'src/session/facets/Display';
import { MoveT } from 'src/moves/types';
import { MoveContainer } from 'src/moves/MoveCtr/MoveCtr';
import { reaction } from 'mobx';
import { useDefaultProps, CtrProvider } from 'react-default-props-context';
import { useStore } from 'src/app/components/StoreProvider';

type PropsT = React.PropsWithChildren<{
  ctrKey?: string;
}>;

type DefaultPropsT = {
  sessionDisplay: SessionDisplay;
  move: MoveT;
};

// Note: don't observe this with MobX
export const MoveCtrProvider: React.FC<PropsT> = (p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);
  const { movesStore } = useStore();

  const createCtr = () => {
    return new MoveContainer({ rootDivId: 'moveDiv' });
  };

  const updateCtr = (ctr: MoveContainer) =>
    reaction(
      () => ({
        move: props.move,
        movePrivateData: movesStore.privateDataByMoveId[props.move?.id],
        sessionDisplay: props.sessionDisplay,
      }),
      ({ move, movePrivateData, sessionDisplay }) => {
        ctr.inputs.move = move;
        ctr.inputs.movePrivateData = movePrivateData;
        ctr.inputs.sessionDisplay = sessionDisplay;
      },
      {
        fireImmediately: true,
      }
    );

  const getDefaultProps = (ctr: MoveContainer) => {
    return {
      moveCtr: () => ctr,
      moveDisplay: () => ctr.display,
      videoController: () => ctr.videoController,
      timePoints: () => ctr.timePoints,
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
