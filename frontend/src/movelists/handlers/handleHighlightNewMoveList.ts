import { MoveListsContainer } from 'src/movelists/MovelistsCtr';
import { Addition } from 'skandha-facets/Addition';
import { Highlight } from 'skandha-facets/Highlight';
import { getCtr } from 'skandha';

export const handleHighlightNewMoveList = (facet: Addition) => {
  const ctr = getCtr<MoveListsContainer>(facet);
  if (facet.item) {
    Highlight.get(ctr).highlightItem(facet.item.id);
  }
};
