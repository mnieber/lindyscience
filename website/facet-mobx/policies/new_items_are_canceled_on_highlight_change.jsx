// @flow

import { reaction } from "facet-mobx";
import { Highlight } from "facet-mobx/facets/highlight";
import { Addition } from "facet-mobx/facets/addition";
import { Editing } from "facet-mobx/facets/editing";

export function newItemsAreCanceledOnHighlightChange(ctr: any) {
  reaction(
    () => Highlight.get(ctr).item,
    highlightedItem => {
      if (Addition.get(ctr).item && Addition.get(ctr).item != highlightedItem) {
        Addition.get(ctr).cancel();
        Editing.get(ctr).setIsEditing(false);
      }
    }
  );
}
