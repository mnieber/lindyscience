// @flow

import { listen } from "screens/data_containers/utils";
import { Editing } from "screens/data_containers/bvrs/editing";
import { Addition } from "screens/data_containers/bvrs/addition";

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
