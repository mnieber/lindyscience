// @flow

import type { InsertT } from "screens/data_containers/bvrs/insertion";
import { Addition } from "screens/data_containers/bvrs/addition";

export const topOfTheList = "<topOfTheList>";

export const insertByCreatingAnItem = ({
  showPreview,
}: {
  showPreview: boolean,
}) => (ctr: any): ?InsertT => {
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
