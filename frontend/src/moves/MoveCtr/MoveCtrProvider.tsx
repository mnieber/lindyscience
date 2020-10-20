import { compose } from 'lodash/fp';
import * as React from 'react';
import { observer } from 'mobx-react';

import { Display } from 'src/session/facets/Display';
import { MoveT } from 'src/moves/types';
import { MoveContainer } from 'src/moves/MoveCtr/MoveCtr';
import { reaction } from 'src/utils/mobx_wrapper';
import { CtrProvider } from 'src/app/CtrProvider';
import { useDefaultProps } from 'react-default-props-context';

type PropsT = {};

type DefaultPropsT = {
  display: Display;
  move: MoveT;
};

export const MoveCtrProvider: React.FC<PropsT> = compose(observer)(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

    const createCtr = () => {
      return new MoveContainer({ rootDivId: 'moveDiv' });
    };

    const updateCtr = (ctr: MoveContainer) => {
      reaction(
        () => ({ move: props.move, display: props.display }),
        ({ move, display }) => {
          ctr.inputs.move = move;
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
  }
);
