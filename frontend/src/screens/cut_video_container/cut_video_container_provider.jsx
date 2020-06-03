// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';

import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MovesStore } from 'src/moves/MovesStore';
import { cutVideoContainerProps } from 'src/screens/cut_video_container/cut_video_container_props';
import { reaction } from 'src/utils/mobx_wrapper';
import { CtrProvider } from 'src/facet-mobx';
import { mergeDefaultProps, withDefaultProps } from 'src/mergeDefaultProps';
import { CutVideoContainer } from 'src/screens/cut_video_container/cut_video_container';
import { Display } from 'src/screens/session_container/facets/display';
import type { UserProfileT } from 'src/profiles/types';
import type { MoveListT } from 'src/move_lists/types';

type PropsT = {
  children: any,
  defaultProps?: any,
};

type DefaultPropsT = {
  display: Display,
  moveList: MoveListT,
  userProfile: UserProfileT,
  moveListsStore: MoveListsStore,
  movesStore: MovesStore,
};

export const CutVideoCtrProvider: (PropsT) => any = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  const createCtr = () => {
    return new CutVideoContainer(
      cutVideoContainerProps(props.moveListsStore, props.movesStore)
    );
  };

  const updateCtr = (ctr) => {
    reaction(
      () => [props.display, props.userProfile, props.moveList],
      ([display, userProfile, moveList]) => {
        ctr.inputs.sessionDisplay = display;
        ctr.inputs.userProfile = userProfile;
        ctr.inputs.moveList = moveList;
      }
    );
  };

  const getDefaultProps = (ctr) => {
    return {
      videoController: () => ctr.cutPoints.videoController,
      cutPoints: () => ctr.cutPoints,
      moveDisplay: () => ctr.display,
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
