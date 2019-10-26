// @flow

import type { InsertT } from "facets/generic/insertion";
import { Dragging } from "facets/generic/dragging";
import { Selection } from "facets/generic/selection";

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
