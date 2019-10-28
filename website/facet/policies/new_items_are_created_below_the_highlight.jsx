// @flow

import { listen } from "facet/index";
import { Addition } from "facet/generic/addition";
import { Highlight } from "facet/generic/highlight";
import { Selection } from "facet/generic/selection";
import { topOfTheList } from "facet/policies/insert_by_creating_a_new_item";

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
