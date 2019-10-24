// @flow

import { reaction } from "utils/mobx_wrapper";
import { Highlight } from "facet/facets/highlight";
import { Addition } from "facet/facets/addition";
import { Editing } from "facet/facets/editing";

export const newItemsAreCanceledOnHighlightChange = (ctr: any) => {
  reaction(
    () => Highlight.get(ctr).item,
    highlightedItem => {
      if (Addition.get(ctr).item && Addition.get(ctr).item != highlightedItem) {
        Addition.get(ctr).cancel();
        Editing.get(ctr).setIsEditing(false);
      }
    },
    { name: "newItemsAreCanceledOnHighlightChange" }
  );
};
