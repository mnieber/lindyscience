import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { Editing } from 'facility-facets/Editing';
import { Highlight } from 'facility-facets/Highlight';
import { getCtr } from 'facility';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/move_lists/types';

export const handleNavigateToSavedMove = (
  facet: Editing,
  navigateToMove: (moveList: MoveListT, move: MoveT) => void
) => {
  const ctr = getCtr<MovesContainer>(facet);
  const item = Highlight.get(ctr).item;
  if (item && ctr.inputs.moveList) {
    navigateToMove(ctr.inputs.moveList, item);
  }
};
