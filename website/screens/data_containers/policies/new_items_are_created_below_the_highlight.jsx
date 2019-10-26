// @flow

import { listen } from "screens/data_containers/utils";
import { Addition } from "screens/data_containers/bvrs/addition";
import { Highlight } from "screens/data_containers/bvrs/highlight";
import { Selection } from "screens/data_containers/bvrs/selection";
import { topOfTheList } from "screens/data_containers/policies/insert_by_creating_a_new_item";

export const newItemsAreCreatedBelowTheHighlight = (ctr: any) => {
  listen(Addition.get(ctr), "add", function(data: any) {
    Addition.get(ctr).parentId = Highlight.get(ctr).id || topOfTheList;
    Selection.get(ctr).selectItem({
      itemId: Addition.get(ctr).item.id,
      isShift: false,
      isCtrl: false,
    });
  });
};
