// @flow

import { runInAction } from 'src/utils/mobx_wrapper';
import { Dragging } from 'src/facet-mobx/facets/dragging';
import { isBefore } from 'src/utils/ui_utils';

export type DragPosition2T = {
  item: any,
};

export type PropsT = {
  container: any,
};

export class DragItems {
  props: PropsT;

  constructor(props: PropsT) {
    this.props = props;
  }

  handle(itemId: any) {
    return {
      draggable: true,
      onDragStart: () => {},
      onDragOver: (e: any) => {
        e.preventDefault();
        runInAction('onDragOver', () => {
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
