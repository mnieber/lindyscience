import * as React from 'react';
import { observer } from 'mobx-react';

import { MovesStore } from 'src/moves/MovesStore';
import { Display } from 'src/session/facets/Display';
import { MoveT } from 'src/moves/types';
import { MoveContainer } from 'src/moves/MoveCtr/MoveCtr';
import { reaction } from 'src/utils/mobx_wrapper';
import { CtrProvider } from 'src/app/CtrProvider';
import { useDefaultProps } from 'react-default-props-context';

type PropsT = React.PropsWithChildren<{}>;

type DefaultPropsT = {
  display: Display;
  move: MoveT;
  movesStore: MovesStore;
};

export const MoveCtrProvider: React.FC<PropsT> = observer((p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);

  const createCtr = () => {
    return new MoveContainer({ rootDivId: 'moveDiv' });
  };

  const updateCtr = (ctr: MoveContainer) => {
    reaction(
      () => ({
        move: props.move,
        movePrivateData: props.movesStore.privateDataByMoveId[props.move?.id],
        display: props.display,
      }),
      ({ move, movePrivateData, display }) => {
        ctr.inputs.move = move;
        ctr.inputs.movePrivateData = movePrivateData;
        ctr.inputs.sessionDisplay = display;
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
      createCtr={createCtr}
      updateCtr={updateCtr}
      getDefaultProps={getDefaultProps}
      children={props.children}
    />
  );
});
