// @flow

import { listen } from 'src/facet';
import { Editing } from 'src/facet-mobx/facets/editing';
import { Addition } from 'src/facet-mobx/facets/addition';

type IsEqualT = (lhs: any, rhs: any) => boolean;

export const newItemsAreConfirmedWhenSaved = (isEqual: IsEqualT) => (
  ctr: any
) => {
  listen(Editing.get(ctr), 'save', function (item: any) {
    const addition = Addition.get(ctr);
    if (addition.item && isEqual(item, addition.item)) {
      Addition.get(ctr).confirm();
    }
  });
  listen(Editing.get(ctr), 'cancel', function () {
    if (Addition.get(ctr).item) {
      Addition.get(ctr).cancel();
    }
  });
};
