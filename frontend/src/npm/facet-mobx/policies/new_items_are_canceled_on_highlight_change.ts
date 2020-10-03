import { reaction } from 'mobx';
import { Highlight } from 'src/npm/facet-mobx/facets/highlight';
import { Addition } from 'src/npm/facet-mobx/facets/addition';
import { Editing } from 'src/npm/facet-mobx/facets/editing';

export function newItemsAreCanceledOnHighlightChange(ctr: any) {
  reaction(
    () => Highlight.get(ctr).id,
    (highlightedItemId) => {
      const addedItemId = Addition.get(ctr).item?.id;
      if (addedItemId && addedItemId !== highlightedItemId) {
        Addition.get(ctr).cancel();
        Editing.get(ctr).setIsEditing(false);
      }
    }
  );
}
