// @flow

import { Labelling } from 'src/facet-mobx/facets/labelling';
import { listen } from 'src/facet';
import { Addition } from 'src/facet-mobx/facets/addition';

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
