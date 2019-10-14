// @flow

import { listen } from "screens/data_containers/utils";
import { Selection } from "screens/data_containers/bvrs/selection";
import { Highlight } from "screens/data_containers/bvrs/highlight";

export const highlightFollowsSelection = (ctr: any) => {
  listen(Selection.get(ctr), "selectItem", ({ itemId, isShift, isCtrl }) => {
    if (!isCtrl && !isShift) {
      Highlight.get(ctr).highlightItem(itemId);
    }
  });
};
