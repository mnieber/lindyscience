// @flow

import { listen } from 'src/npm/facet';
import { Addition } from 'src/npm/facet-mobx/facets/addition';
import { Highlight } from 'src/npm/facet-mobx/facets/highlight';
import { Selection } from 'src/npm/facet-mobx/facets/selection';
import { topOfTheList } from 'src/npm/facet-mobx/policies/insert_by_creating_a_new_item';

export const newItemsAreCreatedBelowTheHighlight = (ctr: any) => {
  listen(Addition.get(ctr), 'add', function (data: any) {
    Addition.get(ctr).parentId = Highlight.get(ctr).id || topOfTheList;
    Selection.get(ctr).selectItem({
      itemId: Addition.get(ctr).item.id,
      isShift: false,
      isCtrl: false,
    });
  });
};
