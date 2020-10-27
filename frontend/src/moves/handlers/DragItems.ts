import { runInAction } from 'src/utils/mobx_wrapper';
import { isBefore } from 'src/utils/ui_utils';
import { Insertion } from 'facet-mobx/facets/Insertion';
import { DragT } from 'facet-mobx/facets/Insertion';

export type PropsT = {
  container: any;
};

export class DragItems {
  props: PropsT;

  constructor(props: PropsT) {
    this.props = props;
  }

  drag?: DragT;

  handle(itemId: any) {
    return {
      draggable: true,
      onDragStart: () => {},
      onDragOver: (e: any) => {
        e.preventDefault();
        runInAction('onDragOver', () => {
          this.drag = {
            payload: this.props.container.selection.items,
            targetItemId: itemId,
            isBefore: isBefore(e),
          };
        });
      },
      onDragEnd: () => {
        this.drag = undefined;
      },
      onDrop: () => {
        if (this.drag) {
          Insertion.get(this.props.container).insertItems(this.drag);
          this.drag = undefined;
        }
      },
    };
  }
}
