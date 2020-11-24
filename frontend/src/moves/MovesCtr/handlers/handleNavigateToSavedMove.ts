import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { Editing } from 'facility-mobx/facets/Editing';
import { Highlight } from 'facility-mobx/facets/Highlight';
import { getCtr } from 'facility';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/move_lists/types';

export const handleNavigateToSavedMove = (
  navigateToMove: (moveList: MoveListT, move: MoveT) => void
) =>
  function (this: Editing) {
    const ctr = getCtr<MovesContainer>(this);
    const item = Highlight.get(ctr).item;
    if (item && ctr.inputs.moveList) {
      navigateToMove(ctr.inputs.moveList, item);
    }
  };
