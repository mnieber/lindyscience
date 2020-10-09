import { Labelling } from 'facet-mobx/facets/labelling';
import { listen } from 'facet';
import { Addition } from 'facet-mobx/facets/addition';

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
