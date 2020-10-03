// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';

import { lookUp } from 'src/utils/utils';
import { Navigation } from 'src/session/facets/Navigation';
import type { MoveListT } from 'src/move_lists/types';
import { Profiling } from 'src/session/facets/Profiling';
import { MovesStore } from 'src/moves/MovesStore';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { movesContainerProps } from 'src/moves/MovesCtr/movesCtrProps';
import { reaction } from 'src/utils/mobx_wrapper';
import { CtrProvider } from 'src/npm/facet-mobx';
import { mergeDefaultProps, withDefaultProps } from 'src/npm/mergeDefaultProps';
import { Editing } from 'src/npm/facet-mobx/facets/editing';
import { Highlight } from 'src/npm/facet-mobx/facets/highlight';

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
