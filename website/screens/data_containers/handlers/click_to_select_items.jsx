// @flow

import type { UUID } from "kernel/types";
import { Selection } from "screens/data_containers/bvrs/selection";

export type ClickToSelectItemsPropsT = {
  container: any,
};

export class ClickToSelectItems {
  props: ClickToSelectItemsPropsT;

  constructor(props: ClickToSelectItemsPropsT) {
    this.props = props;
  }

  handle(itemId: UUID) {
    return {
      onMouseDown: (e: any) => {
        const ctr = this.props.container;
        const isSelected = Selection.get(ctr).ids.includes(itemId);
        if (!isSelected) {
          Selection.get(ctr).selectItem({
            itemId: itemId,
            isShift: e.shiftKey,
            isCtrl: e.ctrlKey,
          });
        }
      },
    };
  }
}
