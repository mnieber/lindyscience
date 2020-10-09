import { compose } from 'lodash/fp';
import * as React from 'react';
import { observer } from 'mobx-react';

import {
  mergeDefaultProps,
  withDefaultProps,
} from 'react-default-props-context';
import { Display } from 'src/session/facets/Display';
import { MoveListT } from 'src/move_lists/types';
import { UserProfileT } from 'src/profiles/types';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MovesStore } from 'src/moves/MovesStore';
import { CutVideoContainer } from 'src/video/CutVideoCtr';
import { cutVideoContainerProps } from 'src/video/CutVideoCtrProps';
import { reaction } from 'src/utils/mobx_wrapper';
import { CtrProvider } from 'src/app/CtrProvider';

type PropsT = {
  children: any;
  defaultProps?: any;
};

type DefaultPropsT = {
  display: Display;
  moveList: MoveListT;
  userProfile: UserProfileT;
  moveListsStore: MoveListsStore;
  movesStore: MovesStore;
};

export const CutVideoCtrProvider: React.FC<PropsT> = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  const createCtr = () => {
    return new CutVideoContainer(
      cutVideoContainerProps(props.moveListsStore, props.movesStore)
    );
  };

  const updateCtr = (ctr: CutVideoContainer) => {
    reaction(
      () => ({
        display: props.display,
        userProfile: props.userProfile,
        moveList: props.moveList,
      }),
      ({ display, userProfile, moveList }) => {
        ctr.inputs.sessionDisplay = display;
        ctr.inputs.userProfile = userProfile;
        ctr.inputs.moveList = moveList;
      }
    );
  };

  const getDefaultProps = (ctr: CutVideoContainer) => {
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
