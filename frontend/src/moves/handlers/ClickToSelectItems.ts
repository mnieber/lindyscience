import { Selection } from 'src/npm/facet-mobx/facets/selection';

export type PropsT = {
  container: any;
};

export class ClickToSelectItems {
  props: PropsT;
  _swallowMouseUp: boolean = false;

  constructor(props: PropsT) {
    this.props = props;
  }

  handle(itemId: any, item?: any, navigateTo?: Function) {
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
          navigateTo && navigateTo(item);
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
          navigateTo && navigateTo(item);
        }
        this._swallowMouseUp = false;
      },
    };
  }
}
