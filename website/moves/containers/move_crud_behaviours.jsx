// @flow

import * as React from "react";
import * as api from "moves/api";

// $FlowFixMe
import uuidv4 from "uuid/v4";
import { createErrorHandler } from "app/utils";
import { newMoveSlug, findMoveBySlugid } from "moves/utils";
import { slugify } from "utils/utils";

import {
  useInsertItems,
  useNewItem,
  useSaveItem,
} from "moves/containers/crud_behaviours";

import type { MoveT, MoveListT, MoveCrudBvrsT } from "moves/types";
import type { UUID, UserProfileT, VoteByIdT, SlugidT } from "app/types";
import type {
  InsertItemsBvrT,
  NewItemBvrT,
  SaveItemBvrT,
} from "moves/containers/crud_behaviours";

// $FlowFixMe
export const MoveCrudBvrsContext = React.createContext({});

export function createNewMove(userProfile: ?UserProfileT): ?MoveT {
  if (!userProfile) {
    return null;
  }

  return {
    id: uuidv4(),
    slug: newMoveSlug,
    name: "New move",
    description: "",
    tips: [],
    videoLinks: [],
    tags: [],
    ownerId: userProfile.userId,
    privateData: null,
  };
}

// InsertMoves Behaviour

export type InsertMovesBvrT = InsertItemsBvrT<MoveT>;

export function useInsertMoves(
  moves: Array<MoveT>,
  actInsertMoves: (
    moveIds: Array<UUID>,
    moveListId: UUID,
    targetMoveId: UUID
  ) => Array<UUID>,
  moveListId: UUID
): InsertMovesBvrT {
  function _insertMoveIds(moveIds: Array<UUID>, targetMoveId: UUID) {
    const allMoveIds = actInsertMoves(moveIds, moveListId, targetMoveId);
    api
      .saveMoveOrdering(moveListId, allMoveIds)
      .catch(createErrorHandler("We could not update the move list"));
  }

  return useInsertItems<MoveT>(moves, _insertMoveIds);
}

// NewMove Behaviour

export type NewMoveBvrT = NewItemBvrT<MoveT>;

export function useNewMove(
  userProfile: ?UserProfileT,
  setHighlightedMoveId: UUID => void,
  highlightedMoveId: UUID,
  insertMovesBvr: InsertMovesBvrT,
  setIsEditing: boolean => void
): NewMoveBvrT {
  function _createNewMove() {
    return createNewMove(userProfile);
  }

  return useNewItem<MoveT>(
    highlightedMoveId,
    setHighlightedMoveId,
    insertMovesBvr,
    setIsEditing,
    _createNewMove
  );
}

// SaveMove Behaviour

export type SaveMoveBvrT = SaveItemBvrT<MoveT>;

export function useSaveMove(
  moves: Array<MoveT>,
  newMoveBvr: NewMoveBvrT,
  setIsEditing: boolean => void,
  updateMove: (oldMove: MoveT, newMove: MoveT) => void
): SaveMoveBvrT {
  type IncompleteValuesT = {
    name: string,
  };

  function _completeMove(
    oldMove: MoveT,
    incompleteValues: IncompleteValuesT
  ): MoveT {
    const newSlug = incompleteValues.name
      ? slugify(incompleteValues.name)
      : undefined;

    return {
      ...oldMove,
      ...incompleteValues,
      slug: newSlug || oldMove.slug,
    };
  }

  function _saveMove(id: UUID, incompleteValues: IncompleteValuesT) {
    const oldMove = moves.find(x => x.id == id);
    if (oldMove) {
      const newMove = _completeMove(oldMove, incompleteValues);
      updateMove(oldMove, newMove);
      return api
        .saveMove(newMove)
        .catch(createErrorHandler("We could not save the move"));
    }
  }

  return useSaveItem<MoveT>(newMoveBvr, setIsEditing, _saveMove);
}

export function createMoveCrudBvrs(
  moves: Array<MoveT>,
  moveList: ?MoveListT,
  userProfile: UserProfileT,
  highlightedMoveSlugid: SlugidT,
  setNextHighlightedMoveId: UUID => void,
  updateMove: (oldMove: MoveT, newMove: MoveT) => void,
  actInsertMoves: (
    moveIds: Array<UUID>,
    moveListId: UUID,
    targetMoveId: UUID
  ) => Array<UUID>
): MoveCrudBvrsT {
  const highlightedMoveInStore = findMoveBySlugid(moves, highlightedMoveSlugid);

  const [isEditing, setIsEditing] = React.useState(false);

  const insertMovesBvr: InsertMovesBvrT = useInsertMoves(
    moves,
    actInsertMoves,
    moveList ? moveList.id : ""
  );

  const newMoveBvr: NewMoveBvrT = useNewMove(
    userProfile,
    setNextHighlightedMoveId,
    highlightedMoveInStore ? highlightedMoveInStore.id : "",
    insertMovesBvr,
    setIsEditing
  );

  const saveMoveBvr: SaveMoveBvrT = useSaveMove(
    insertMovesBvr.preview,
    newMoveBvr,
    setIsEditing,
    updateMove
  );

  const bvrs: MoveCrudBvrsT = {
    isEditing,
    setIsEditing,
    insertMovesBvr,
    newMoveBvr,
    saveMoveBvr,
  };

  return bvrs;
}
