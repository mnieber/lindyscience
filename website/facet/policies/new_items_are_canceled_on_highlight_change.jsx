// @flow

import { reaction } from "utils/mobx_wrapper";
import { Highlight } from "facet/generic/highlight";
import { Addition } from "facet/generic/addition";
import { Editing } from "facet/generic/editing";

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
