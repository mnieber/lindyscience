import { Selection } from 'facility-mobx/facets/Selection';

export type PropsT = {
  container: any;
};

export class ClickToSelectItems {
  props: PropsT;
  _selectOnMouseUp?: string = undefined;

  constructor(props: PropsT) {
    this.props = props;
  }

  handle(itemId: any, item?: any) {
    return {
      onMouseDown: (e: any) => {
        const ctr = this.props.container;
        const isSelected = Selection.get(ctr).ids.includes(itemId);
        if (!isSelected) {
          this._selectOnMouseUp = undefined;
          Selection.get(ctr).selectItem({
            itemId: itemId,
            isShift: e.shiftKey,
            isCtrl: e.ctrlKey,
          });
        } else {
          this._selectOnMouseUp = itemId;
        }
      },
      onMouseUp: (e: any) => {
        const ctr = this.props.container;
        const isSelected = Selection.get(ctr).ids.includes(itemId);
        if (this._selectOnMouseUp === itemId && (!e.ctrlKey || isSelected)) {
          Selection.get(ctr).selectItem({
            itemId: itemId,
            isShift: e.shiftKey,
            isCtrl: e.ctrlKey,
          });
        }
        this._selectOnMouseUp = undefined;
      },
    };
  }
}
