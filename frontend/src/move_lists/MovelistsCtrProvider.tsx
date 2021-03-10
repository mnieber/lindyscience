import { values } from 'lodash/fp';
import * as React from 'react';

import { MoveListsContainer } from 'src/move_lists/MovelistsCtr';
import { reaction } from 'mobx';
import { CtrProvider } from 'react-default-props-context';
import { Editing } from 'facility-mobx/facets/Editing';
import { Highlight } from 'facility-mobx/facets/Highlight';
import { useStore } from 'src/app/components/StoreProvider';
import { MoveListT } from 'src/move_lists/types';

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
      }
    );

    reaction(
      () => ctr.highlight.item,
      (moveList: MoveListT) => {
        if (
          moveList &&
          !window.location.pathname.startsWith(
            '/lists/' + moveList.ownerUsername + '/' + moveList.slug
          )
        ) {
          navigationStore.navigateToMoveList(moveList);
        }
      }
    );
  };

  const getDefaultProps = (ctr: MoveListsContainer) => {
    return {
      moveListsCtr: () => ctr,
      isEditingMoveList: () => Editing.get(ctr).isEditing,
      moveList: () => Highlight.get(ctr).item,
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
      getDefaultProps={getDefaultProps}
    >
      {props.children}
    </CtrProvider>
  );
};
