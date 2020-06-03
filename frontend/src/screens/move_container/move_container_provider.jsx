// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';

import { reaction } from 'src/utils/mobx_wrapper';
import { CtrProvider } from 'src/facet-mobx';
import { mergeDefaultProps, withDefaultProps } from 'src/mergeDefaultProps';
import { MoveContainer } from 'src/screens/move_container/move_container';
import { Display } from 'src/screens/session_container/facets/display';
import { moveContainerProps } from 'src/screens/move_container/move_container_props';
import type { MoveT } from 'src/moves/types';

type PropsT = {
  children: any,
  defaultProps?: any,
};

type DefaultPropsT = {
  display: Display,
  move: MoveT,
};

export const MoveCtrProvider: (PropsT) => any = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  const createCtr = () => {
    return new MoveContainer(moveContainerProps());
  };

  const updateCtr = (ctr) => {
    reaction(
      () => [props.move, props.display],
      ([move, display]) => {
        ctr.inputs.move = move;
        ctr.inputs.sessionDisplay = display;
      }
    );
  };

  const getDefaultProps = (ctr) => {
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
