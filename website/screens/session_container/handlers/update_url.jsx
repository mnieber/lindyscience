// @flow

import type { MoveListT } from "move_lists/types";
import type { MoveT } from "moves/types";
import {
  makeMoveListUrl,
  makeSlugidMatcher,
  newMoveListSlug,
} from "screens/utils";
import { getId } from "app/utils";
import { browseToMoveUrl } from "screens/containers";

export function browseToMove(
  history: any,
  moveList: MoveListT,
  moves: Array<MoveT>,
  move: MoveT
) {
  const isSlugUnique = moves.filter(makeSlugidMatcher(move.slug)).length <= 1;
  const maybeMoveId = isSlugUnique ? "" : getId(move);
  browseToMoveUrl(
    history,
    [makeMoveListUrl(moveList), move.slug, maybeMoveId],
    true
  );
}

export function browseToMoveList(history: any, moveList: MoveListT) {
  const updateProfile = moveList.slug != newMoveListSlug;
  browseToMoveUrl(history, [makeMoveListUrl(moveList)], updateProfile);
}
