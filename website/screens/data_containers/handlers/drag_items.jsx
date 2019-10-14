// @flow

import type { UUID } from "kernel/types";
import { Dragging } from "screens/data_containers/bvrs/dragging";
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

  handle(itemId: UUID) {
    return {
      draggable: true,
      onDragStart: () => {},
      onDragOver: (e: any) => {
        e.preventDefault();
        // TODO use action
        Dragging.get(this.props.container).position = {
          targetItemId: itemId,
          isBefore: isBefore(e),
        };
      },
      onDragEnd: () => Dragging.get(this.props.container).cancel(),
      onDrop: () => Dragging.get(this.props.container).drop(),
    };
  }
}
