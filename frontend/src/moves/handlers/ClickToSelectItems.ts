import { Selection } from 'skandha-facets/Selection';

export type PropsT = {
  selection: Selection;
};

export class ClickToSelectItems {
  props: PropsT;
  _selectOnMouseUp?: string = undefined;

  constructor(props: PropsT) {
    this.props = props;
  }

  handle(itemId: any) {
    return {
      onMouseDown: (e: any) => {
        const isSelected = this.props.selection.ids.includes(itemId);
        if (!isSelected) {
          this._selectOnMouseUp = undefined;
          this.props.selection.selectItem({
            itemId: itemId,
            isShift: e.shiftKey,
            isCtrl: e.ctrlKey,
          });
        } else {
          this._selectOnMouseUp = itemId;
        }
      },
      onMouseUp: (e: any) => {
        const isSelected = this.props.selection.ids.includes(itemId);
        if (this._selectOnMouseUp === itemId && (!e.ctrlKey || isSelected)) {
          this.props.selection.selectItem({
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
