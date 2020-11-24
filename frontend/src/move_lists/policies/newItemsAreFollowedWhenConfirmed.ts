import { getCtr } from 'facility';
import { Labelling } from 'facility-mobx/facets/Labelling';
import { Addition } from 'facility-mobx/facets/Addition';

export function newItemsAreFollowedWhenConfirmed(this: Addition) {
  const ctr = getCtr(this);
  Labelling.get(ctr).setLabel({
    label: 'following',
    id: this.item.id,
    flag: true,
  });
}
