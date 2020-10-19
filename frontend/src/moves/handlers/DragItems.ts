import { runInAction } from 'src/utils/mobx_wrapper';
import { isBefore } from 'src/utils/ui_utils';
import { DragAndDrop } from 'facet-mobx/facets/DragAndDrop';

export type DragPosition2T = {
  item: any;
};

export type PropsT = {
  container: any;
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
          DragAndDrop.get(this.props.container).hoverPosition = {
            targetItemId: itemId,
            isBefore: isBefore(e),
          };
        });
      },
      onDragEnd: () => DragAndDrop.get(this.props.container).cancel(),
      onDrop: () => DragAndDrop.get(this.props.container).drop(),
    };
  }
}
