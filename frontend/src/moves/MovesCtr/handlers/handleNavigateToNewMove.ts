import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { Addition } from 'facet-mobx/facets/Addition';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/move_lists/types';
import { getCtr } from 'facet';

export const handleNavigateToNewMove = (
  navigateToMove: (moveList: MoveListT, move: MoveT) => void
) =>
  function (this: Addition) {
    const ctr = getCtr<MovesContainer>(this);
    if (this.item && ctr.inputs.moveList) {
      navigateToMove(ctr.inputs.moveList, this.item);
    }
  };
