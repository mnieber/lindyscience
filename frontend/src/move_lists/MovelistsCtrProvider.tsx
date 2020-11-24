import { values } from 'lodash/fp';
import * as React from 'react';

import { Profiling } from 'src/session/facets/Profiling';
import { Navigation } from 'src/session/facets/Navigation';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MoveListsContainer } from 'src/move_lists/MovelistsCtr';
import { reaction } from 'src/utils/mobx_wrapper';
import { useDefaultProps, FC, CtrProvider } from 'react-default-props-context';
import { Editing } from 'facility-mobx/facets/Editing';
import { Highlight } from 'facility-mobx/facets/Highlight';

type PropsT = React.PropsWithChildren<{}>;

type DefaultPropsT = {
  profiling: Profiling;
  navigation: Navigation;
  moveListsStore: MoveListsStore;
};

// Note: don't observe this with MobX
export const MoveListsCtrProvider: FC<PropsT, DefaultPropsT> = (p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);

  const createCtr = () => {
    return new MoveListsContainer({
      navigation: props.navigation,
      profiling: props.profiling,
      moveListsStore: props.moveListsStore,
    });
  };

  const updateCtr = (ctr: MoveListsContainer) =>
    reaction(
      () => ({
        moveListById: props.moveListsStore.moveListById,
        userProfile: props.profiling.userProfile,
      }),
      ({ moveListById, userProfile }) => {
        ctr.inputs.setMoveLists(values(moveListById));
        ctr.inputs.setUserProfile(userProfile);
      }
    );

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
