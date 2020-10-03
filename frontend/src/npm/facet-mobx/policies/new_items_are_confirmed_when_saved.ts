import { listen } from 'src/npm/facet';
import { Editing } from 'src/npm/facet-mobx/facets/editing';
import { Addition } from 'src/npm/facet-mobx/facets/addition';

type IsEqualT = (lhs: any, rhs: any) => boolean;

export const newItemsAreConfirmedWhenSaved = (isEqual: IsEqualT) => (
  ctr: any
) => {
  listen(Editing.get(ctr), 'save', function (item: any) {
    const addition = Addition.get(ctr);
    if (addition.item && isEqual(item, addition.item)) {
      Addition.get(ctr).confirm({});
    }
  });
  listen(Editing.get(ctr), 'cancel', function () {
    if (Addition.get(ctr).item) {
      Addition.get(ctr).cancel();
    }
  });
};
