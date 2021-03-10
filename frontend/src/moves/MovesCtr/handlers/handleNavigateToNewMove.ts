import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { Addition } from 'facility-mobx/facets/Addition';
import { Highlight } from 'facility-mobx/facets/Highlight';
import { getCtr } from 'facility';

export const handleHighlightNewMove = (facet: Addition) => {
  const ctr = getCtr<MovesContainer>(facet);
  if (facet.item && ctr.inputs.moveList) {
    Highlight.get(ctr).highlightItem(facet.item.id);
  }
};
