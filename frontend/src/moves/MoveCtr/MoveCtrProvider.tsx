import { compose } from 'lodash/fp';
import * as React from 'react';
import { observer } from 'mobx-react';

import { Display } from 'src/session/facets/Display';
import { MoveT } from 'src/moves/types';
import { MoveContainer } from 'src/moves/MoveCtr/MoveCtr';
import { moveContainerProps } from 'src/moves/MoveCtr/moveCtrProps';
import { reaction } from 'src/utils/mobx_wrapper';
import { CtrProvider } from 'src/npm/facet-mobx';
import { mergeDefaultProps, withDefaultProps } from 'src/npm/mergeDefaultProps';

type PropsT = {
  children: any;
  defaultProps?: any;
};

type DefaultPropsT = {
  display: Display;
  move: MoveT;
};

export const MoveCtrProvider: React.FC<PropsT> = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  const createCtr = () => {
    return new MoveContainer(moveContainerProps());
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
});
