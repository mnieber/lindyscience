// @flow

import { reaction } from "utils/mobx_wrapper";
import { Highlight } from "screens/data_containers/bvrs/highlight";
import { Addition } from "screens/data_containers/bvrs/addition";
import { Editing } from "screens/data_containers/bvrs/editing";

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
