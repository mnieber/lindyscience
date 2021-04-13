import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { NavigationStore } from 'src/app/NavigationStore';

export const handleNavigateToHighlightedItem = (
  ctr: MovesContainer,
  navigationStore: NavigationStore
) => {
  if (ctr.highlight.item && ctr.inputs.moveList) {
    navigationStore.navigateToMove(ctr.inputs.moveList, ctr.highlight.item);
  }
};
