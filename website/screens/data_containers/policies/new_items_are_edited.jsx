// @flow

import { listen } from "screens/data_containers/utils";
import { Addition } from "screens/data_containers/bvrs/addition";
import { Editing } from "screens/data_containers/bvrs/editing";

export const newItemsAreEdited = (ctr: any) => {
  listen(Addition.get(ctr), "add", function(data: any) {
    Editing.get(ctr).setIsEditing(true);
  });
};
