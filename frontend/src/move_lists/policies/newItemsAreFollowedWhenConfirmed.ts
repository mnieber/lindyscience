import { getCtr } from 'facet';
import { Labelling } from 'facet-mobx/facets/Labelling';
import { Addition } from 'facet-mobx/facets/Addition';

export function newItemsAreFollowedWhenConfirmed(this: Addition) {
  const ctr = getCtr(this);
  Labelling.get(ctr).setLabel({
    label: 'following',
    id: this.item.id,
    flag: true,
  });
}
