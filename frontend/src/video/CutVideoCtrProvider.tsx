import * as React from 'react';

import { useDefaultProps, FC } from 'react-default-props-context';
import { Display as SessionDisplay } from 'src/session/facets/Display';
import { MoveListT } from 'src/move_lists/types';
import { UserProfileT } from 'src/profiles/types';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MovesStore } from 'src/moves/MovesStore';
import { CutVideoContainer } from 'src/video/CutVideoCtr';
import { cutVideoContainerProps } from 'src/video/CutVideoCtrProps';
import { reaction } from 'src/utils/mobx_wrapper';
import { CtrProvider } from 'src/app/CtrProvider';

type PropsT = React.PropsWithChildren<{}>;

type DefaultPropsT = {
  sessionDisplay: SessionDisplay;
  moveList: MoveListT;
  userProfile: UserProfileT;
  moveListsStore: MoveListsStore;
  movesStore: MovesStore;
};

// Note: don't observe this with MobX
export const CutVideoCtrProvider: FC<PropsT, DefaultPropsT> = (p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);

  const createCtr = () => {
    return new CutVideoContainer(
      cutVideoContainerProps(props.moveListsStore, props.movesStore)
    );
  };

  const updateCtr = (ctr: CutVideoContainer) => {
    reaction(
      () => ({
        sessionDisplay: props.sessionDisplay,
        userProfile: props.userProfile,
        moveList: props.moveList,
      }),
      ({ sessionDisplay, userProfile, moveList }) => {
        ctr.inputs.sessionDisplay = sessionDisplay;
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
};
