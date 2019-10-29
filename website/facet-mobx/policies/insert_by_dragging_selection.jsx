// @flow

import type { InsertT } from "facet-mobx/facets/insertion";
import { Dragging } from "facet-mobx/facets/dragging";
import { Selection } from "facet-mobx/facets/selection";

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
