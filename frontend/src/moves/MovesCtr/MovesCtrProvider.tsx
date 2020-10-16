import { compose } from 'lodash/fp';
import * as React from 'react';
import { observer } from 'mobx-react';

import { lookUp } from 'src/utils/utils';
import { Navigation } from 'src/session/facets/Navigation';
import { MoveListT } from 'src/move_lists/types';
import { Profiling } from 'src/session/facets/Profiling';
import { MovesStore } from 'src/moves/MovesStore';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { reaction } from 'src/utils/mobx_wrapper';
import { CtrProvider } from 'src/app/CtrProvider';
import {
  mergeDefaultProps,
  withDefaultProps,
} from 'react-default-props-context';
import { Editing } from 'facet-mobx/facets/editing';
import { Highlight } from 'facet-mobx/facets/highlight';

type PropsT = {
  children: any;
  defaultProps?: any;
};

type DefaultPropsT = {
  navigation: Navigation;
  moveList: MoveListT;
  profiling: Profiling;
  movesStore: MovesStore;
  moveListsStore: MoveListsStore;
  moveListsPreview: Array<MoveListT>;
};

export const MovesCtrProvider: React.FC<PropsT> = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);
  const createCtr = () => {
    return new MovesContainer({
      navigation: props.navigation,
      moveListsStore: props.moveListsStore,
      movesStore: props.movesStore,
    });
  };

  const updateCtr = (ctr: MovesContainer) => {
    reaction(
      () => ({
        inputMoves: props.moveList
          ? lookUp(
              props.moveList ? props.moveList.moves : [],
              props.movesStore.moveById
            ).filter((x) => !!x)
          : [],
        userProfile: props.profiling.userProfile,
        moveList: props.moveList,
        moveListsPreview: props.moveListsPreview,
      }),
      ({ inputMoves, userProfile, moveList, moveListsPreview }) => {
        ctr.inputs.moves = inputMoves;
        ctr.inputs.userProfile = userProfile;
        ctr.inputs.moveList = moveList;
        ctr.inputs.moveLists = moveListsPreview;
      }
    );
  };

  const getDefaultProps = (ctr: MovesContainer) => {
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
