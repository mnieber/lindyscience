// @flow

import { reaction } from "utils/mobx_wrapper";
import { Highlight } from "facets/generic/highlight";
import { Addition } from "facets/generic/addition";
import { Editing } from "facets/generic/editing";

export const newItemsAreCanceledOnHighlightChange = (ctr: any) => {
  reaction(
    () => Highlight.get(ctr).item,
    highlightedItem => {
      if (Addition.get(ctr).item && Addition.get(ctr).item != highlightedItem) {
        Addition.get(ctr).cancel();
        Editing.get(ctr).setIsEditing(false);
      }
    }
  );
};
