import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { Editing } from 'skandha-facets/Editing';
import { Highlight } from 'skandha-facets/Highlight';
import { getf, getc } from 'skandha';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/movelists/types';

export const handleNavigateToSavedMove = (
  facet: Editing,
  navigateToMove: (moveList: MoveListT, move: MoveT) => void
) => {
  const ctr = getc<MovesContainer>(facet);
  const item = getf(Highlight, ctr).item;
  if (item && ctr.inputs.moveList) {
    navigateToMove(ctr.inputs.moveList, item);
  }
};
