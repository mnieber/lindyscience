import { Highlight } from 'skandha-facets/Highlight';
import { NavigationStore } from 'src/session/NavigationStore';

export const handleNavigateToHighlightedItem = (
  facet: Highlight,
  navigationStore: NavigationStore
) => {
  const moveList = facet.item;
  if (
    moveList &&
    !window.location.pathname.startsWith(
      '/lists/' + moveList.ownerUsername + '/' + moveList.slug
    )
  ) {
    navigationStore.navigateToMoveList(moveList);
  }
};
