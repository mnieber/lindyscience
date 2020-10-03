import { Labelling } from 'src/npm/facet-mobx/facets/labelling';
import { listen } from 'src/npm/facet';
import { Addition } from 'src/npm/facet-mobx/facets/addition';

export const newItemsAreFollowedWhenConfirmed = (ctr: any) => {
  const addition = Addition.get(ctr);
  listen(addition, 'confirm', function (data: any) {
    Labelling.get(ctr).setLabel({
      label: 'following',
      id: addition.item.id,
      flag: true,
    });
  });
};
