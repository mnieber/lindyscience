import { MoveListsContainer } from 'src/move_lists/MovelistsCtr';
import { Addition } from 'facility-mobx/facets/Addition';
import { Highlight } from 'facility-mobx/facets/Highlight';
import { getCtr } from 'facility';

export const handleHighlightNewMoveList = (facet: Addition) => {
  const ctr = getCtr<MoveListsContainer>(facet);
  if (facet.item) {
    Highlight.get(ctr).highlightItem(facet.item.id);
  }
};
