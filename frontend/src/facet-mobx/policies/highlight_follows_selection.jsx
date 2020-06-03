// @flow

import { listen } from 'src/facet';
import { Selection } from 'src/facet-mobx/facets/selection';
import { Highlight } from 'src/facet-mobx/facets/highlight';

export const highlightFollowsSelection = (ctr: any) => {
  listen(Selection.get(ctr), 'selectItem', ({ itemId, isShift, isCtrl }) => {
    if (!isCtrl && !isShift) {
      Highlight.get(ctr).highlightItem(itemId);
    }
  });
};
