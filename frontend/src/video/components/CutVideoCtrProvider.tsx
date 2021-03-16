import * as React from 'react';

import { useDefaultProps, FC, CtrProvider } from 'react-default-props-context';
import { Display as SessionDisplay } from 'src/session/facets/Display';
import { MoveListT } from 'src/movelists/types';
import { CutVideoContainer } from 'src/video/CutVideoCtr';
import { reaction } from 'mobx';
import { useStore } from 'src/app/components/StoreProvider';

type PropsT = React.PropsWithChildren<{}>;

type DefaultPropsT = {
  sessionDisplay: SessionDisplay;
  moveList: MoveListT;
};

// Note: don't observe this with MobX
export const CutVideoCtrProvider: FC<PropsT, DefaultPropsT> = (p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);
  const { profilingStore, cutPointsStore } = useStore();

  const createCtr = () => {
    return new CutVideoContainer({
      rootDivId: 'cutVideoPanel',
      cutPointsStore,
    });
  };

  const updateCtr = (ctr: CutVideoContainer) =>
    reaction(
      () => ({
        sessionDisplay: props.sessionDisplay,
        userProfile: profilingStore.userProfile,
        moveList: props.moveList,
      }),
      ({ sessionDisplay, userProfile, moveList }) => {
        ctr.inputs.sessionDisplay = sessionDisplay;
        ctr.inputs.userProfile = userProfile;
        ctr.inputs.moveList = moveList;
      },
      {
        fireImmediately: true,
      }
    );

  const getDefaultProps = (ctr: CutVideoContainer) => {
    return {
      cutPoints: () => cutPointsStore.cutPoints,
      videoController: () => ctr.videoController,
      cutPointsAddition: () => ctr.addition,
      cutPointsEditing: () => ctr.editing,
      cutPointsDeletion: () => ctr.deletion,
      moveDisplay: () => ctr.display,
    };
  };

  return (
    <CtrProvider
      createCtr={createCtr}
      destroyCtr={(ctr) => ctr.destroy()}
      updateCtr={updateCtr}
      getDefaultProps={getDefaultProps}
      children={props.children}
    />
  );
};
