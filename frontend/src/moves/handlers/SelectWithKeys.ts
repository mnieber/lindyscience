import { pickNeighbour2, scrollIntoView } from 'src/app/utils';
import { Highlight } from 'skandha-facets/Highlight';
import { Selection } from 'skandha-facets/Selection';
import { getf } from 'skandha';

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
          const highlight = getf(Highlight, ctr);
          if (highlight.id) {
            const selectMoveById = (moveId: any) => {
              scrollIntoView(document.getElementById(moveId));
              getf(Selection, ctr).selectItem({
                itemId: moveId,
                isShift: e.shiftKey,
                isCtrl: false,
              });
            };

            pickNeighbour2(
              getf(Selection, ctr).selectableIds || [],
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
