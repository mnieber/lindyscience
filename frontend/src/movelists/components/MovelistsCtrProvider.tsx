import { values } from 'lodash/fp';
import * as React from 'react';

import { MoveListsContainer } from 'src/movelists/MovelistsCtr';
import { reaction } from 'mobx';
import { CtrProvider } from 'react-default-props-context';
import { useStore } from 'src/app/components/StoreProvider';

type PropsT = React.PropsWithChildren<{}>;

// Note: don't observe this with MobX
export const MoveListsCtrProvider: React.FC<PropsT> = (props: PropsT) => {
  const { moveListsStore, navigationStore, profilingStore } = useStore();

  const createCtr = () => {
    return new MoveListsContainer({
      navigationStore: navigationStore,
      profilingStore: profilingStore,
      moveListsStore: moveListsStore,
    });
  };

  const updateCtr = (ctr: MoveListsContainer) => {
    reaction(
      () => ({
        moveListById: moveListsStore.moveListById,
        userProfile: profilingStore.userProfile,
      }),
      ({ moveListById, userProfile }) => {
        ctr.inputs.setMoveLists(values(moveListById));
        ctr.inputs.setUserProfile(userProfile);
      },
      {
        fireImmediately: true,
      }
    );
  };

  const getDefaultProps = (ctr: MoveListsContainer) => {
    return {
      moveListsCtr: () => ctr,
      isEditingMoveList: () => ctr.editing.isEditing,
      moveList: () => ctr.highlight.item,
      moveLists: () => ctr.outputs.display,
      moveListsEditing: () => ctr.editing,
      moveListsHighlight: () => ctr.highlight,
      moveListsSelection: () => ctr.selection,
      moveListsLabelling: () => ctr.labelling,
      moveListsAddition: () => ctr.addition,
    };
  };

  return (
    <CtrProvider
      createCtr={createCtr}
      updateCtr={updateCtr}
      destroyCtr={(ctr) => ctr.destroy()}
      getDefaultProps={getDefaultProps}
    >
      {props.children}
    </CtrProvider>
  );
};
