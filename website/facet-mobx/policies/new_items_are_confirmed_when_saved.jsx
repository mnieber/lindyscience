// @flow

import { listen } from "facet";
import { Editing } from "facet-mobx/facets/editing";
import { Addition } from "facet-mobx/facets/addition";

export const newItemsAreConfirmedWhenSaved = (ctr: any) => {
  listen(Editing.get(ctr), "save", function(item: any) {
    const addition = Addition.get(ctr);
    if (addition.item && addition.isEqual(item, addition.item)) {
      Addition.get(ctr).confirm();
    }
  });
  listen(Editing.get(ctr), "cancel", function() {
    if (Addition.get(ctr).item) {
      Addition.get(ctr).cancel();
    }
  });
};
