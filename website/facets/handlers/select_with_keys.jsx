// @flow

import { Highlight } from "facets/generic/highlight";
import { pickNeighbour2, scrollIntoView } from "app/utils";
import { Selection } from "facets/generic/selection";

export type SelectWithKeysPropsT = {
  container: any,
};

export class SelectWithKeys {
  props: SelectWithKeysPropsT;

  constructor(props: SelectWithKeysPropsT) {
    this.props = props;
  }

  handle(keyUp: string, keyDown: string, navigateTo: ?Function) {
    return {
      onKeyDown: (key: string, e: any) => {
        const ctr = this.props.container;
        if ([keyDown, keyUp].includes(key)) {
          e.preventDefault();
          e.stopPropagation();
          const highlight = Highlight.get(ctr);
          if (highlight.id) {
            const selectMoveById = (moveId: any) => {
              scrollIntoView(document.getElementById(moveId));
              Selection.get(ctr).selectItem({
                itemId: moveId,
                isShift: e.shiftKey,
                isCtrl: false,
              });
              navigateTo && navigateTo(highlight.item);
            };

            pickNeighbour2(
              Selection.get(ctr).selectableIds,
              highlight.id,
              key == keyDown,
              selectMoveById
            );
          }
        }
      },
    };
  }
}
