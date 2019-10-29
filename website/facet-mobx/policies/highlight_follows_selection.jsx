// @flow

import { listen } from "facet";
import { Selection } from "facet-mobx/facets/selection";
import { Highlight } from "facet-mobx/facets/highlight";

export const highlightFollowsSelection = (ctr: any) => {
  listen(Selection.get(ctr), "selectItem", ({ itemId, isShift, isCtrl }) => {
    if (!isCtrl && !isShift) {
      Highlight.get(ctr).highlightItem(itemId);
    }
  });
};
