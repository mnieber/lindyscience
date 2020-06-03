// @flow

import type { InsertT } from 'src/facet-mobx/facets/insertion';
import { Dragging } from 'src/facet-mobx/facets/dragging';
import { Selection } from 'src/facet-mobx/facets/selection';

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
