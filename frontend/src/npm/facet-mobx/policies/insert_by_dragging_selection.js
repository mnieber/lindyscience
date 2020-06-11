// @flow

import type { InsertT } from 'src/npm/facet-mobx/facets/insertion';
import { Dragging } from 'src/npm/facet-mobx/facets/dragging';
import { Selection } from 'src/npm/facet-mobx/facets/selection';

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
