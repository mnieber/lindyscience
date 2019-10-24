// @flow

import { makeMoveListUrl } from "screens/utils";
import { computed } from "utils/mobx_wrapper";
import type { MoveT } from "moves/types";
import type { MoveListT } from "move_lists/types";
import { MovesContainer } from "screens/data_containers/moves_container";

type PropsT = {
  ctr: MovesContainer,
  shareMovesToList: (Array<MoveT>, MoveListT, ?MoveListT) => any,
};

export class Clipboard {
  props: PropsT;

  constructor(props: PropsT) {
    this.props = props;
  }

  // $FlowFixMe
  @computed get targetMoveLists() {
    const ids = this.props.ctr.selection.ids;
    // $FlowFixMe
    return this.props.ctr.data.moveLists.filter(moveList => {
      ids.some(moveId => !moveList.moves.includes(moveId));
    });
  }

  shareToList(moveList: MoveListT) {
    this.props.shareMovesToList(
      this.props.ctr.selection.items,
      moveList,
      undefined
    );
  }

  moveToList(moveList: MoveListT) {
    this.props.shareMovesToList(
      this.props.ctr.selection.items,
      moveList,
      this.props.ctr.data.moveList
    );
  }

  copyNames() {
    const selection = this.props.ctr.selection.items;
    const text = selection
      .map((move: MoveT) => {
        return move.name;
      })
      .join("\n");
    navigator.clipboard.writeText(text);
  }

  copyLinks() {
    const moveList = this.props.ctr.data.moveList;
    const selection = this.props.ctr.selection.items;

    if (moveList && selection.length) {
      const text = selection
        .map((move: MoveT) => {
          return (
            "http://www.lindyscience.org/app/lists/" +
            makeMoveListUrl(moveList) +
            "/" +
            move.slug
          );
        })
        .join("\n");
      navigator.clipboard.writeText(text);
    }
  }
}
