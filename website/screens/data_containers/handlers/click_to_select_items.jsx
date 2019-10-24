// @flow

import type { UUID } from "kernel/types";
import { Selection } from "screens/data_containers/bvrs/selection";

export type ClickToSelectItemsPropsT = {
  container: any,
};

export class ClickToSelectItems {
  props: ClickToSelectItemsPropsT;
  _swallowMouseUp: boolean = false;

  constructor(props: ClickToSelectItemsPropsT) {
    this.props = props;
  }

  handle(itemId: UUID) {
    return {
      onMouseDown: (e: any) => {
        const ctr = this.props.container;
        const isSelected = Selection.get(ctr).ids.includes(itemId);
        if (!isSelected) {
          this._swallowMouseUp = true;
          Selection.get(ctr).selectItem({
            itemId: itemId,
            isShift: e.shiftKey,
            isCtrl: e.ctrlKey,
          });
        }
      },
      onMouseUp: (e: any) => {
        const ctr = this.props.container;
        const isSelected = Selection.get(ctr).ids.includes(itemId);
        if (!this._swallowMouseUp && (!e.ctrlKey || isSelected)) {
          Selection.get(ctr).selectItem({
            itemId: itemId,
            isShift: e.shiftKey,
            isCtrl: e.ctrlKey,
          });
        }
        this._swallowMouseUp = false;
      },
    };
  }
}
