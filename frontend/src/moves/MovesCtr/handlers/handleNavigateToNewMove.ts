import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { Addition } from 'facility-mobx/facets/Addition';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/move_lists/types';
import { getCtr } from 'facility';

export const handleNavigateToNewMove = (
  facet: Addition,
  navigateToMove: (moveList: MoveListT, move: MoveT) => void
) => {
  const ctr = getCtr<MovesContainer>(facet);
  if (facet.item && ctr.inputs.moveList) {
    navigateToMove(ctr.inputs.moveList, facet.item);
  }
};
