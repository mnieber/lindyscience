// @flow

import { Highlight } from "facet-mobx/facets/highlight";
import { pickNeighbour2, scrollIntoView } from "app/utils";
import { Selection } from "facet-mobx/facets/selection";

export type SelectWithKeysPropsT = {
  container: any,
};

export class SelectWithKeys {
  props: SelectWithKeysPropsT;

  constructor(props: SelectWithKeysPropsT) {
    this.props = props;
  }

  handle(
    keysUp: Array<string>,
    keysDown: Array<string>,
    navigateTo: ?Function
  ) {
    return {
      onKeyDown: (key: string, e: any) => {
        const ctr = this.props.container;
        const isUp = keysUp.includes(key);
        const isDown = keysDown.includes(key);
        if (keysUp || keysDown) {
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
              isDown,
              selectMoveById
            );
          }
        }
      },
    };
  }
}
