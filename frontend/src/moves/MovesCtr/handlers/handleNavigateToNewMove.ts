import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { Addition } from 'skandha-facets/Addition';
import { Highlight } from 'skandha-facets/Highlight';
import { getCtr } from 'skandha';

export const handleHighlightNewMove = (facet: Addition) => {
  const ctr = getCtr<MovesContainer>(facet);
  if (facet.item && ctr.inputs.moveList) {
    Highlight.get(ctr).highlightItem(facet.item.id);
  }
};
