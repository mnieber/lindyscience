import * as React from 'react';

import { lookUp } from 'src/utils/utils';
import { MoveListT } from 'src/move_lists/types';
import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { reaction } from 'mobx';
import { useDefaultProps, CtrProvider } from 'react-default-props-context';
import { Highlight } from 'facility-mobx/facets/Highlight';
import { useStore } from 'src/app/components/StoreProvider';
import { MoveT } from 'src/moves/types';

type PropsT = React.PropsWithChildren<{}>;

type DefaultPropsT = {
  moveList: MoveListT;
  moveLists: Array<MoveListT>;
};

// Note: don't observe this with MobX
export const MovesCtrProvider: React.FC<PropsT> = (p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);
  const {
    navigationStore,
    moveListsStore,
    movesStore,
    profilingStore,
  } = useStore();

  const createCtr = () => {
    return new MovesContainer({
      navigationStore: navigationStore,
      moveListsStore: moveListsStore,
      movesStore: movesStore,
    });
  };

  const updateCtr = (ctr: MovesContainer) => {
    reaction(
      () => ({
        inputMoves: props.moveList
          ? lookUp(
              props.moveList ? props.moveList.moves : [],
              movesStore.moveById
            ).filter((x) => !!x)
          : [],
        userProfile: profilingStore.userProfile,
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

    reaction(
      () => ctr.highlight.item,
      (highlightedMove: MoveT) => {
        if (highlightedMove) {
          navigationStore.navigateToMove(props.moveList, highlightedMove);
        }
      }
    );
  };

  const getDefaultProps = (ctr: MovesContainer) => {
    const movePrivateData = () => {
      const moveId = Highlight.get(ctr).id;
      return moveId ? movesStore.getOrCreatePrivateData(moveId) : undefined;
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
