import { pickNeighbour2, scrollIntoView } from 'src/app/utils';
import { Highlight } from 'facility-mobx/facets/Highlight';
import { Selection } from 'facility-mobx/facets/Selection';

export type PropsT = {
  container: any;
};

export class SelectWithKeys {
  props: PropsT;

  constructor(props: PropsT) {
    this.props = props;
  }

  handle(keysUp: Array<string>, keysDown: Array<string>) {
    return {
      onKeyDown: (key: string, e: any) => {
        const ctr = this.props.container;
        // const isUp = keysUp.includes(key);
        const isDown = keysDown.includes(key);
        if (keysUp || keysDown) {
          e.preventDefault();
          e.stopPropagation();
          const highlight = Highlight.get(ctr);
          if (highlight.id) {
            const selectMoveById = (moveId: any) => {
              scrollIntoView(document.getElementById(moveId));
              Selection.get(ctr).selectItem({
                itemId: moveId,
                isShift: e.shiftKey,
                isCtrl: false,
              });
            };

            pickNeighbour2(
              Selection.get(ctr).selectableIds || [],
              highlight.id,
              isDown,
              selectMoveById
            );
          }
        }
      },
    };
  }
}
