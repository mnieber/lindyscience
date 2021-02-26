import { getCtr } from 'facility';
import { Labelling } from 'facility-mobx/facets/Labelling';
import { Addition } from 'facility-mobx/facets/Addition';

export function newItemsAreFollowedWhenConfirmed(facet: Addition) {
  const ctr = getCtr(facet);
  Labelling.get(ctr).setLabel({
    label: 'following',
    id: facet.item.id,
    flag: true,
  });
}
