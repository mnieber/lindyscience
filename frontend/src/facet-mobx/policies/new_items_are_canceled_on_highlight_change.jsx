// @flow

// $FlowFixMe
import { reaction } from 'mobx';
import { Highlight } from 'src/facet-mobx/facets/highlight';
import { Addition } from 'src/facet-mobx/facets/addition';
import { Editing } from 'src/facet-mobx/facets/editing';

export function newItemsAreCanceledOnHighlightChange(ctr: any) {
  reaction(
    () => Highlight.get(ctr).id,
    (highlightedItemId) => {
      const addedItemId = Addition.get(ctr).item?.id;
      if (addedItemId && addedItemId != highlightedItemId) {
        Addition.get(ctr).cancel();
        Editing.get(ctr).setIsEditing(false);
      }
    }
  );
}
