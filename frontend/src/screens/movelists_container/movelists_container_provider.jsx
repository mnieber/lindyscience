// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';

import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { Profiling } from 'src/screens/session_container/facets/profiling';
import { reaction } from 'src/utils/mobx_wrapper';
import { CtrProvider } from 'src/facet-mobx';
import { mergeDefaultProps, withDefaultProps } from 'src/mergeDefaultProps';
import { MoveListsContainer } from 'src/screens/movelists_container/movelists_container';
import { Editing } from 'src/facet-mobx/facets/editing';
import { Highlight } from 'src/facet-mobx/facets/highlight';
import { Navigation } from 'src/screens/session_container/facets/navigation';
import { moveListsContainerProps } from 'src/screens/movelists_container/movelists_container_props';
import type { MoveListT } from 'src/move_lists/types';

type PropsT = {
  children: any,
  defaultProps?: any,
};

type DefaultPropsT = {
  profiling: Profiling,
  navigation: Navigation,
  moveListsStore: MoveListsStore,
};

export const MoveListsCtrProvider: (PropsT) => any = compose(
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
