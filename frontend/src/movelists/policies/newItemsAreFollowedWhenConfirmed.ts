import { getf, getc } from 'skandha';
import { Labelling } from 'skandha-facets/Labelling';
import { Addition } from 'skandha-facets/Addition';

export function newItemsAreFollowedWhenConfirmed(facet: Addition) {
  const ctr = getc(facet);
  getf(Labelling, ctr).setLabel({
    label: 'following',
    id: facet.item.id,
    flag: true,
  });
}
