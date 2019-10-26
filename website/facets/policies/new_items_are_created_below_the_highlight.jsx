// @flow

import { listen } from "facets/index";
import { Addition } from "facets/generic/addition";
import { Highlight } from "facets/generic/highlight";
import { Selection } from "facets/generic/selection";
import { topOfTheList } from "facets/policies/insert_by_creating_a_new_item";

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
