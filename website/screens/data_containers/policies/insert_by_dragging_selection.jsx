// @flow

import type { InsertT } from "screens/data_containers/bvrs/insertion";
import { Dragging } from "screens/data_containers/bvrs/dragging";
import { Selection } from "screens/data_containers/bvrs/selection";

export const insertByDraggingSelection = ({
  showPreview,
}: {
  showPreview: boolean,
}) => (ctr: any): ?InsertT => {
  const position = Dragging.get(ctr).position;
  const items = Selection.get(ctr).items;

  return items.length && position
    ? {
        payload: {
          data: items,
          showPreview,
        },
        position: {
          targetItemId: position.targetItemId,
          isBefore: position.isBefore,
        },
      }
    : undefined;
};
