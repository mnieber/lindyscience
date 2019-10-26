// @flow

import { listen } from "facets/index";
import { Addition } from "facets/generic/addition";
import { Editing } from "facets/generic/editing";

export const newItemsAreEdited = (ctr: any) => {
  listen(Addition.get(ctr), "add", function(data: any) {
    Editing.get(ctr).setIsEditing(true);
  });
};
