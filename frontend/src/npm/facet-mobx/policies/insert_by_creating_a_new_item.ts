// @flow

import { InsertT } from 'src/npm/facet-mobx/facets/insertion';
import { Addition } from 'src/npm/facet-mobx/facets/addition';

export const topOfTheList = '<topOfTheList>';

export const insertByCreatingAnItem = ({
  showPreview,
}: {
  showPreview: boolean;
}) => (ctr: any): InsertT | undefined => {
  const parentId = Addition.get(ctr).parentId;
  const item = Addition.get(ctr).item;

  return item && parentId
    ? {
        payload: {
          data: [item],
          showPreview,
        },
        position: {
          targetItemId: parentId == topOfTheList ? undefined : parentId,
          isBefore: false,
        },
      }
    : undefined;
};
