// @flow

import { listen } from "facets/index";
import { Editing } from "facets/generic/editing";
import { Addition } from "facets/generic/addition";

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
