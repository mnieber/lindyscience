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
  moveList: MoveListT,
  moves: Array<MoveT>,
  move: MoveT
) {
  const isSlugUnique = moves.filter(makeSlugidMatcher(move.slug)).length <= 1;
  const maybeMoveId = isSlugUnique ? "" : getId(move);
  browseToMoveUrl([makeMoveListUrl(moveList), move.slug, maybeMoveId], true);
}

export function browseToMoveList(moveList: MoveListT) {
  const updateProfile = moveList.slug != newMoveListSlug;
  browseToMoveUrl([makeMoveListUrl(moveList)], updateProfile);
}
