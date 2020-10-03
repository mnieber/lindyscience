import { listen } from 'src/npm/facet';
import { Addition } from 'src/npm/facet-mobx/facets/addition';
import { Editing } from 'src/npm/facet-mobx/facets/editing';

export const newItemsAreEdited = (ctr: any) => {
  listen(Addition.get(ctr), 'add', function (data: any) {
    Editing.get(ctr).setIsEditing(true);
  });
};
