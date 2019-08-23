// @flow

import * as React from "react";
import { makeSlugidMatcher } from "screens/utils";
import { browseToMove } from "app/containers/index";
import { newMoveSlug, newMoveListSlug, makeMoveListUrl } from "screens/utils";

import type { MoveListT } from "screens/types";
import type { MoveT } from "moves/types";
import type { UUID } from "kernel/types";

function _browseToMove(moves: Array<MoveT>, move: MoveT, moveListUrl: string) {
  const matcher = makeSlugidMatcher(move.slug);
  const isSlugUnique = moves.filter(matcher).length <= 1;
  const updateProfile = move.slug != newMoveSlug;
  const maybeMoveId = isSlugUnique ? "" : move ? move.id : "";
  browseToMove([moveListUrl, move.slug, maybeMoveId], updateProfile);
}

function _setSelectedMoveListById(moveLists: Array<MoveListT>, id: UUID) {
  const moveList = moveLists.find(x => x.id == id) || moveLists.find(x => true);

  if (moveList) {
    const updateProfile = moveList.slug != newMoveListSlug;
    browseToMove([makeMoveListUrl(moveList)], updateProfile);
  }
}

export type NavigationBvrT = {
  setNextSelectedMoveListId: UUID => void,
  setNextHighlightedMoveId: UUID => void,
  browseToMove: MoveT => void,
};

export function useNavigation(
  moveList: ?MoveListT,
  moveLists: Array<MoveListT>,
  moves: Array<MoveT>
): NavigationBvrT {
  const [nextSelectedMoveListId, setNextSelectedMoveListId] = React.useState(
    null
  );
  React.useEffect(() => {
    if (nextSelectedMoveListId != null) {
      _setSelectedMoveListById(moveLists, nextSelectedMoveListId);
    }
  }, [nextSelectedMoveListId]);

  const [nextHighlightedMoveId, setNextHighlightedMoveId] = React.useState(
    null
  );

  React.useEffect(() => {
    if (moveList && nextHighlightedMoveId != null) {
      const move =
        moves.find(x => x.id == nextHighlightedMoveId) || moves.find(x => true);
      if (move) {
        _browseToMove(moves, move, makeMoveListUrl(moveList));
      }
    }
  }, [nextHighlightedMoveId]);

  function browseToMove(move: MoveT) {
    _browseToMove(moves, move, makeMoveListUrl(moveList));
  }

  return {
    setNextSelectedMoveListId,
    setNextHighlightedMoveId,
    browseToMove,
  };
}
