import { getCtr } from 'skandha';
import { Labelling } from 'skandha-facets/Labelling';
import { Addition } from 'skandha-facets/Addition';

export function newItemsAreFollowedWhenConfirmed(facet: Addition) {
  const ctr = getCtr(facet);
  Labelling.get(ctr).setLabel({
    label: 'following',
    id: facet.item.id,
    flag: true,
  });
}
