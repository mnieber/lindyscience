// @flow

import { listen } from "facet/index";
import { Editing } from "facet/facets/editing";
import { Addition } from "facet/facets/addition";

export const newItemsAreConfirmedWhenSaved = (ctr: any) => {
  listen(Editing.get(ctr), "save", function(item: any) {
    if (item == Addition.get(ctr).item) {
      Addition.get(ctr).confirm();
    }
  });
  listen(Editing.get(ctr), "cancel", function() {
    if (Addition.get(ctr).item) {
      Addition.get(ctr).cancel();
    }
  });
};
