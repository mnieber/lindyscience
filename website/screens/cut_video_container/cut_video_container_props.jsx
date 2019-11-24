// @flow

import { createMoveFromCutPoint } from "screens/utils";
import { actAddMoves } from "moves/actions";
import { actInsertMoveIds } from "move_lists/actions";
import { apiSaveMove } from "moves/api";
import { createErrorHandler } from "app/utils";
import { apiSaveMoveOrdering } from "move_lists/api";
import type { CutPointT } from "video/types";
import type { UserProfileT } from "profiles/types";
import type { MoveT } from "moves/types";
import type { MoveListT } from "move_lists/types";

export function cutVideoContainerProps(dispatch: Function) {
  const saveMoves = (newMoves: Array<MoveT>, moveList: MoveListT) => {
    const lastMoveIdx = moveList.moves.length - 1;
    const lastMoveId = lastMoveIdx >= 0 ? moveList.moves[lastMoveIdx] : "";

    dispatch(actAddMoves(newMoves));
    const moveIdsInMoveList = dispatch(
      actInsertMoveIds(newMoves.map(x => x.id), moveList.id, lastMoveId, false)
    );

    newMoves.forEach(newMove => {
      apiSaveMove(newMove).catch(
        createErrorHandler("We could not save the move")
      );
      apiSaveMoveOrdering(moveList.id, moveIdsInMoveList).catch(
        createErrorHandler("We could not update the movelist")
      );
    });
  };

  return {
    saveMoves,
    rootDivId: "cutVideoPanel",
  };
}
