import { listen } from 'facet';
import { Labelling } from 'facet-mobx/facets/Labelling';
import { Addition } from 'facet-mobx/facets/Addition';

export const newItemsAreFollowedWhenConfirmed = (ctr: any) => {
  const addition = Addition.get(ctr);
  listen(
    addition,
    'confirm',
    function () {
      Labelling.get(ctr).setLabel({
        label: 'following',
        id: addition.item.id,
        flag: true,
      });
    },
    { after: false }
  );
};
