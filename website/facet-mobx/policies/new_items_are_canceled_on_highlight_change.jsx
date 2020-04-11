// @flow

import { reaction } from "facet-mobx";
import { Highlight } from "facet-mobx/facets/highlight";
import { Addition } from "facet-mobx/facets/addition";
import { Editing } from "facet-mobx/facets/editing";
import { path } from "rambda";

export function newItemsAreCanceledOnHighlightChange(ctr: any) {
  reaction(
    () => Highlight.get(ctr).id,
    highlightedItemId => {
      const addedItemId = path("item.id", Addition.get(ctr));
      if (addedItemId && addedItemId != highlightedItemId) {
        Addition.get(ctr).cancel();
        Editing.get(ctr).setIsEditing(false);
      }
    }
  );
}
