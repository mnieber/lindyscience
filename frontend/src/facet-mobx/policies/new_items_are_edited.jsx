// @flow

import { listen } from 'src/facet';
import { Addition } from 'src/facet-mobx/facets/addition';
import { Editing } from 'src/facet-mobx/facets/editing';

export const newItemsAreEdited = (ctr: any) => {
  listen(Addition.get(ctr), 'add', function (data: any) {
    Editing.get(ctr).setIsEditing(true);
  });
};
