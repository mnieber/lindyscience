// @flow

import { Editing } from "screens/data_containers/bvrs/editing";
import { Highlight } from "screens/data_containers/bvrs/highlight";
import { pickNeighbour2, scrollIntoView } from "app/utils";
import { Selection } from "screens/data_containers/bvrs/selection";

export type SelectWithKeysPropsT = {
  container: any,
};

export class SelectWithKeys {
  props: SelectWithKeysPropsT;

  constructor(props: SelectWithKeysPropsT) {
    this.props = props;
  }

  handle() {
    return {
      onKeyDown: (key: string, e: any) => {
        const ctr = this.props.container;
        if (key == "ctrl+e") {
          e.preventDefault();
          e.stopPropagation();
          Editing.get(ctr).setIsEditing(!Editing.get(ctr).isEditing);
        }
        if (["ctrl+down", "ctrl+up"].includes(key)) {
          e.preventDefault();
          e.stopPropagation();
          const moveId = Highlight.get(ctr).id;
          if (moveId) {
            const selectMoveById = (moveId: any) => {
              scrollIntoView(document.getElementById(moveId));
              Selection.get(ctr).selectItem({
                itemId: moveId,
                isShift: false,
                isCtrl: false,
              });
            };

            pickNeighbour2(
              Selection.get(ctr).selectableIds,
              moveId,
              key == "ctrl+down",
              selectMoveById
            );
          }
        }
      },
    };
  }
}
