// @flow

import { listen } from "facet";
import { Addition } from "facet-mobx/facets/addition";
import { Highlight } from "facet-mobx/facets/highlight";
import { Selection } from "facet-mobx/facets/selection";
import { topOfTheList } from "facet-mobx/policies/insert_by_creating_a_new_item";

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
