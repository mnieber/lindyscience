// @flow

import { listen } from "facets/index";
import { Selection } from "facets/generic/selection";
import { Highlight } from "facets/generic/highlight";

export const highlightFollowsSelection = (ctr: any) => {
  listen(Selection.get(ctr), "selectItem", ({ itemId, isShift, isCtrl }) => {
    if (!isCtrl && !isShift) {
      Highlight.get(ctr).highlightItem(itemId);
    }
  });
};
