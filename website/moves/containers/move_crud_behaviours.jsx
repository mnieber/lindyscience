// @flow

import * as React from "react";
import * as api from "moves/api";

// $FlowFixMe
import uuidv4 from "uuid/v4";
import { createErrorHandler } from "app/utils";
import { newMoveSlug } from "moves/utils";
import { slugify } from "utils/utils";

import {
  useInsertItems,
  useNewItem,
  useSaveItem,
} from "moves/containers/crud_behaviours";

import type { DataContainerT } from "moves/containers/data_container";
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

// InsertMoves Behaviour

export type InsertMovesBvrT = InsertItemsBvrT<MoveT>;

// NewMove Behaviour

export type NewMoveBvrT = NewItemBvrT<MoveT>;

export function useNewMove(
  userProfile: ?UserProfileT,
  setNextHighlightedMoveId: UUID => void,
  highlightedMoveId: UUID,
  insertMovesBvr: InsertMovesBvrT,
  setIsEditing: boolean => void
): NewMoveBvrT {
  function _createNewMove() {
    return createNewMove(userProfile);
  }

  return useNewItem<MoveT>(
    highlightedMoveId,
    setNextHighlightedMoveId,
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
  function _saveMove(id: UUID, incompleteValues: IncompleteValuesT) {
    const oldMove = moves.find(x => x.id == id);
    if (oldMove) {
      const newMove = _completeMove(oldMove, incompleteValues);
      return updateMove(oldMove, newMove);
    }
  }

  return useSaveItem<MoveT>(newMoveBvr, setIsEditing, _saveMove);
}

export function createMoveCrudBvrs(
  moveList: ?MoveListT,
  userProfile: UserProfileT,
  highlightedMoveId: UUID,
  setNextHighlightedMoveId: UUID => void,
  movesContainer: DataContainerT<MoveT>,
  browseToMove: MoveT => void,
  actAddMoves: Function
): MoveCrudBvrsT {
  const [isEditing, setIsEditing] = React.useState(false);

  const insertMovesBvr = useInsertItems(movesContainer);

  const newMoveBvr: NewMoveBvrT = useNewMove(
    userProfile,
    setNextHighlightedMoveId,
    highlightedMoveId,
    insertMovesBvr,
    setIsEditing
  );

  function updateMove(oldMove: MoveT, newMove: MoveT) {
    actAddMoves([newMove]);
    if (highlightedMoveId == oldMove.id) {
      browseToMove(newMove);
    }
    return api
      .saveMove(newMove)
      .catch(createErrorHandler("We could not save the move"));
  }

  const saveMoveBvr: SaveMoveBvrT = useSaveMove(
    movesContainer.preview,
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
