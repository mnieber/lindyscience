// @flow

import { listen } from "facet/index";
import { Addition } from "facet/facets/addition";
import { Editing } from "facet/facets/editing";

export const newItemsAreEdited = (ctr: any) => {
  listen(Addition.get(ctr), "add", function(data: any) {
    Editing.get(ctr).setIsEditing(true);
  });
};
