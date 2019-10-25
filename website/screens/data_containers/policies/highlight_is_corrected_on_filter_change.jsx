// @flow

import { listen } from "screens/data_containers/utils";
import { Filtering } from "screens/data_containers/bvrs/filtering";
import { Highlight } from "screens/data_containers/bvrs/highlight";
import { findNeighbourIdx2 } from "screens/utils";

export const highlightIsCorrectedOnFilterChange = (ctr: any) => {
  const _correctHighlight = () => {
    const highlight = Highlight.get(ctr).id;
    const inputItems = Filtering.get(ctr).inputItems;
    const filteredItemIds = Filtering.get(ctr).filteredItems.map(x => x.id);
    const inputIds = (inputItems || []).map(x => x.id);

    if (
      highlight &&
      inputIds.includes(highlight) &&
      !filteredItemIds.includes(highlight)
    ) {
      (console: any).log("Correcting bad highlight", highlight);
      const highlightedItemIdx = inputIds.indexOf(highlight);
      const newIdx =
        findNeighbourIdx2(
          filteredItemIds,
          inputIds,
          highlightedItemIdx,
          inputIds.length,
          1
        ) ||
        findNeighbourIdx2(
          filteredItemIds,
          inputIds,
          highlightedItemIdx,
          -1,
          -1
        );

      if (newIdx) {
        Highlight.get(ctr).highlightItem(inputIds[newIdx.result]);
      }
    }
  };

  listen(Filtering.get(ctr), "apply", () => {
    if (Filtering.get(ctr).isEnabled) {
      _correctHighlight();
    }
  });
};
