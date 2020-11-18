import * as React from 'react';

import { MovesStore } from 'src/moves/MovesStore';
import { Display as SessionDisplay } from 'src/session/facets/Display';
import { MoveT } from 'src/moves/types';
import { MoveContainer } from 'src/moves/MoveCtr/MoveCtr';
import { reaction } from 'src/utils/mobx_wrapper';
import { CtrProvider } from 'src/app/CtrProvider';
import { useDefaultProps } from 'react-default-props-context';

type PropsT = React.PropsWithChildren<{
  ctrKey?: string;
}>;

type DefaultPropsT = {
  sessionDisplay: SessionDisplay;
  move: MoveT;
  movesStore: MovesStore;
};

// Note: don't observe this with MobX
export const MoveCtrProvider: React.FC<PropsT> = (p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);

  const createCtr = () => {
    return new MoveContainer({ rootDivId: 'moveDiv' });
  };

  const updateCtr = (ctr: MoveContainer) => {
    reaction(
      () => ({
        move: props.move,
        movePrivateData: props.movesStore.privateDataByMoveId[props.move?.id],
        sessionDisplay: props.sessionDisplay,
      }),
      ({ move, movePrivateData, sessionDisplay }) => {
        ctr.inputs.move = move;
        ctr.inputs.movePrivateData = movePrivateData;
        ctr.inputs.sessionDisplay = sessionDisplay;
      }
    );
  };

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
      updateCtr={updateCtr}
      getDefaultProps={getDefaultProps}
      children={props.children}
    />
  );
};
