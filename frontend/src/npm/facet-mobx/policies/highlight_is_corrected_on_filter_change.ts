import { listen } from 'src/npm/facet';
import { Filtering } from 'src/npm/facet-mobx/facets/filtering';
import { Highlight } from 'src/npm/facet-mobx/facets/highlight';

function findNeighbourIdx(
  filteredItems: Array<any>,
  allItems: Array<any>,
  beginIndex: number,
  endIndex: number,
  step: number
) {
  for (var idx = beginIndex; idx != endIndex; idx += step) {
    if (filteredItems.includes(allItems[idx])) {
      return { result: idx };
    }
  }
  return undefined;
}

export const highlightIsCorrectedOnFilterChange = (ctr: any) => {
  const _correctHighlight = () => {
    const highlight = Highlight.get(ctr).id;
    const inputItems = Filtering.get(ctr).inputItems;
    const filteredItemIds = Filtering.get(ctr).filteredItems.map((x) => x.id);
    const inputIds = (inputItems || []).map((x) => x.id);

    if (
      highlight &&
      inputIds.includes(highlight) &&
      !filteredItemIds.includes(highlight)
    ) {
      console.log('Correcting bad highlight', highlight);
      const highlightedItemIdx = inputIds.indexOf(highlight);
      const newIdx =
        findNeighbourIdx(
          filteredItemIds,
          inputIds,
          highlightedItemIdx,
          inputIds.length,
          1
        ) ||
        findNeighbourIdx(filteredItemIds, inputIds, highlightedItemIdx, -1, -1);

      if (newIdx) {
        Highlight.get(ctr).highlightItem(inputIds[newIdx.result]);
      }
    }
  };

  listen(Filtering.get(ctr), 'apply', () => {
    if (Filtering.get(ctr).isEnabled) {
      _correctHighlight();
    }
  });
};
