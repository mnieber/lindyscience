// @flow

import { runInAction } from "utils/mobx_wrapper";
import { Dragging } from "facet/facets/dragging";
import { isBefore } from "utils/ui_utils";

export type DragPosition2T = {
  item: any,
};

export type DragItemsPropsT = {
  container: any,
};

export class DragItems {
  props: DragItemsPropsT;

  constructor(props: DragItemsPropsT) {
    this.props = props;
  }

  handle(itemId: any) {
    return {
      draggable: true,
      onDragStart: () => {},
      onDragOver: (e: any) => {
        e.preventDefault();
        runInAction("onDragOver", () => {
          Dragging.get(this.props.container).position = {
            targetItemId: itemId,
            isBefore: isBefore(e),
          };
        });
      },
      onDragEnd: () => Dragging.get(this.props.container).cancel(),
      onDrop: () => Dragging.get(this.props.container).drop(),
    };
  }
}
