import * as React from 'react';

import { lookUp } from 'src/utils/utils';
import { Navigation } from 'src/session/facets/Navigation';
import { MoveListT } from 'src/move_lists/types';
import { Profiling } from 'src/session/facets/Profiling';
import { MovesStore } from 'src/moves/MovesStore';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { reaction } from 'src/utils/mobx_wrapper';
import { useDefaultProps, CtrProvider } from 'react-default-props-context';
import { Highlight } from 'facet-mobx/facets/Highlight';

type PropsT = React.PropsWithChildren<{}>;

type DefaultPropsT = {
  navigation: Navigation;
  moveList: MoveListT;
  profiling: Profiling;
  movesStore: MovesStore;
  moveListsStore: MoveListsStore;
  moveLists: Array<MoveListT>;
};

// Note: don't observe this with MobX
export const MovesCtrProvider: React.FC<PropsT> = (p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);
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
        moveLists: props.moveLists,
      }),
      ({ inputMoves, userProfile, moveList, moveLists }) => {
        ctr.inputs.moves = inputMoves;
        ctr.inputs.userProfile = userProfile;
        ctr.inputs.moveList = moveList;
        ctr.inputs.moveLists = moveLists;
      }
    );
  };

  const getDefaultProps = (ctr: MovesContainer) => {
    const movePrivateData = () => {
      const moveId = Highlight.get(ctr).id;
      return moveId
        ? props.movesStore.getOrCreatePrivateData(moveId)
        : undefined;
    };

    return {
      movesCtr: () => ctr,
      move: () => Highlight.get(ctr).item,
      movePrivateData: () => movePrivateData(),
      moves: () => ctr.outputs.display,
      movesEditing: () => ctr.editing,
      movesEditingPD: () => ctr.editingPrivateData,
      movesHighlight: () => ctr.highlight,
      movesSelection: () => ctr.selection,
      movesClipboard: () => ctr.clipboard,
      movesFiltering: () => ctr.filtering,
      movesAddition: () => ctr.addition,
      movesInsertion: () => ctr.insertion,
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
