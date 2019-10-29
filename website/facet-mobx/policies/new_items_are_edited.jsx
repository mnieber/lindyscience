// @flow

import { listen } from "facet";
import { Addition } from "facet-mobx/facets/addition";
import { Editing } from "facet-mobx/facets/editing";

export const newItemsAreEdited = (ctr: any) => {
  listen(Addition.get(ctr), "add", function(data: any) {
    Editing.get(ctr).setIsEditing(true);
  });
};
