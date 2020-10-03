import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';

import { Profiling } from 'src/session/facets/Profiling';
import { Navigation } from 'src/session/facets/Navigation';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MoveListsContainer } from 'src/move_lists/MovelistsCtr';
import { moveListsContainerProps } from 'src/move_lists/movelistsCtrProps';
import { reaction } from 'src/utils/mobx_wrapper';
import { CtrProvider } from 'src/npm/facet-mobx';
import { mergeDefaultProps, withDefaultProps } from 'src/npm/mergeDefaultProps';
import { Editing } from 'src/npm/facet-mobx/facets/editing';
import { Highlight } from 'src/npm/facet-mobx/facets/highlight';

type PropsT = {
  children: any;
  defaultProps?: any;
};

type DefaultPropsT = {
  profiling: Profiling;
  navigation: Navigation;
  moveListsStore: MoveListsStore;
};

export const MoveListsCtrProvider: React.FC<PropsT> = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  const createCtr = () => {
    return new MoveListsContainer(
      moveListsContainerProps(
        props.navigation,
        props.profiling,
        props.moveListsStore
      )
    );
  };

  const updateCtr = (ctr) => {
    reaction(
      () => [props.moveListsStore.moveListById, props.profiling.userProfile],
      ([moveListById, userProfile]) => {
        ctr.inputs.moveLists = Object.values(moveListById);
        ctr.inputs.userProfile = userProfile;
      }
    );
  };

  const getDefaultProps = (ctr) => {
    return {
      moveListsCtr: () => ctr,
      isEditingMoveList: () => Editing.get(ctr).isEditing,
      moveList: () => Highlight.get(ctr).item,
      moveLists: () => ctr.outputs.display,
      moveListsPreview: () => ctr.outputs.preview,
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
      children={props.children}
    />
  );
});
