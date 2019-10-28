// @flow

import type { InsertT } from "facet/generic/insertion";
import { Dragging } from "facet/generic/dragging";
import { Selection } from "facet/generic/selection";

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
