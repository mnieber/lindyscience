// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';

import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { Profiling } from 'src/screens/session_container/facets/profiling';
import { MovesStore } from 'src/moves/MovesStore';
import { reaction } from 'src/utils/mobx_wrapper';
import { CtrProvider } from 'src/facet-mobx';
import { mergeDefaultProps, withDefaultProps } from 'src/mergeDefaultProps';
import { MovesContainer } from 'src/screens/moves_container/moves_container';
import { Editing } from 'src/facet-mobx/facets/editing';
import { Highlight } from 'src/facet-mobx/facets/highlight';
import { lookUp } from 'src/utils/utils';
import { Navigation } from 'src/screens/session_container/facets/navigation';
import { movesContainerProps } from 'src/screens/moves_container/moves_container_props';
import type { MoveListT } from 'src/move_lists/types';

type PropsT = {
  children: any,
  defaultProps?: any,
};

type DefaultPropsT = {
  navigation: Navigation,
  moveList: MoveListT,
  profiling: Profiling,
  movesStore: MovesStore,
  moveListsStore: MoveListsStore,
  moveListsPreview: Array<MoveListT>,
};

export const MovesCtrProvider: (PropsT) => any = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);
  const createCtr = () => {
    return new MovesContainer(
      movesContainerProps(
        props.navigation,
        props.moveListsStore,
        props.movesStore
      )
    );
  };

  const updateCtr = (ctr) => {
    reaction(
      () => [
        props.moveList
          ? lookUp(
              props.moveList ? props.moveList.moves : [],
              props.movesStore.moveById
            ).filter((x) => !!x)
          : [],
        props.profiling.userProfile,
        props.moveList,
        props.moveListsPreview,
      ],
      ([inputMoves, userProfile, moveList, moveListsPreview]) => {
        ctr.inputs.moves = inputMoves;
        ctr.inputs.userProfile = userProfile;
        ctr.inputs.moveList = moveList;
        ctr.inputs.moveLists = moveListsPreview;
      }
    );
  };

  const getDefaultProps = (ctr) => {
    return {
      movesCtr: () => ctr,
      isEditingMove: () => Editing.get(ctr).isEditing,
      move: () => Highlight.get(ctr).item,
      moves: () => ctr.outputs.display,
      movesPreview: () => ctr.outputs.preview,
      movesEditing: () => ctr.editing,
      movesDragging: () => ctr.dragging,
      movesHighlight: () => ctr.highlight,
      movesSelection: () => ctr.selection,
      movesClipboard: () => ctr.clipboard,
      movesFiltering: () => ctr.filtering,
      movesAddition: () => ctr.addition,
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
