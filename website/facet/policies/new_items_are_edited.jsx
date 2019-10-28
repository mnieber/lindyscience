// @flow

import { listen } from "facet/index";
import { Addition } from "facet/generic/addition";
import { Editing } from "facet/generic/editing";

export const newItemsAreEdited = (ctr: any) => {
  listen(Addition.get(ctr), "add", function(data: any) {
    Editing.get(ctr).setIsEditing(true);
  });
};
