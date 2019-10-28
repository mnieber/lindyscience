// @flow

import { listen } from "facet/index";
import { Selection } from "facet/generic/selection";
import { Highlight } from "facet/generic/highlight";

export const highlightFollowsSelection = (ctr: any) => {
  listen(Selection.get(ctr), "selectItem", ({ itemId, isShift, isCtrl }) => {
    if (!isCtrl && !isShift) {
      Highlight.get(ctr).highlightItem(itemId);
    }
  });
};
