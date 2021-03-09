import { MovesContainer } from 'src/moves/MovesCtr/MovesCtr';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/move_lists/types';
import { computed } from 'mobx';
import { makeMoveListUrl } from 'src/app/utils';

type PropsT = {
  ctr: MovesContainer;
  shareMovesToList: (
    moves: Array<MoveT>,
    toMoveList: MoveListT,
    removeFromMoveList?: MoveListT
  ) => any;
};

export class Clipboard {
  props: PropsT;

  constructor(props: PropsT) {
    this.props = props;
  }

  @computed get targetMoveLists() {
    const ids = this.props.ctr.selection.ids;
    return this.props.ctr.inputs.moveLists.filter((moveList) => {
      return ids.some((moveId) => !moveList.moves.includes(moveId));
    });
  }

  shareToList(moveList: MoveListT) {
    this.props.shareMovesToList(
      this.props.ctr.selection.items ?? [],
      moveList,
      undefined
    );
  }

  moveToList(moveList: MoveListT) {
    this.props.shareMovesToList(
      this.props.ctr.selection.items ?? [],
      moveList,
      this.props.ctr.inputs.moveList
    );
  }

  moveToTrash() {
    const trashList = this.props.ctr.inputs.moveLists.find(
      (x) => x.role === 'TRASH'
    );
    if (trashList) {
      this.props.shareMovesToList(
        this.props.ctr.selection.items ?? [],
        trashList,
        this.props.ctr.inputs.moveList
      );
    }
  }

  copyNames() {
    const selection = this.props.ctr.selection.items ?? [];
    const text = selection
      .map((move: MoveT) => {
        return move.name;
      })
      .join('\n');
    navigator.clipboard.writeText(text);
  }

  copyLinks() {
    const moveList = this.props.ctr.inputs.moveList;
    const selection = this.props.ctr.selection.items ?? [];

    if (moveList && selection.length) {
      const text = selection
        .map((move: MoveT) => {
          return (
            'http://www.lindyscience.org/app/lists/' +
            makeMoveListUrl(moveList) +
            '/' +
            move.slug
          );
        })
        .join('\n');
      navigator.clipboard.writeText(text);
    }
  }
}
