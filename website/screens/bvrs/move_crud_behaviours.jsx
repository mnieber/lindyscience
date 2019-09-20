// @flow

import * as React from "react";
import * as api from "screens/api";
import * as movesApi from "moves/api";

// $FlowFixMe
import uuidv4 from "uuid/v4";
import { createErrorHandler } from "app/utils";
import { newMoveSlug } from "moves/utils";
import { slugify } from "utils/utils";

import {
  useInsertItems,
  useNewItem,
  useSaveItem,
} from "screens/bvrs/crud_behaviours";

import type { DataContainerT } from "screens/containers/data_container";
import type { MoveListT } from "move_lists/types";
import type { MoveCrudBvrsT } from "screens/types";
import type { MoveT } from "moves/types";
import type { UUID } from "kernel/types";
import type { UserProfileT } from "profiles/types";
import type {
  InsertItemsBvrT,
  NewItemBvrT,
  SaveItemBvrT,
} from "screens/bvrs/crud_behaviours";

// $FlowFixMe
export const MoveCrudBvrsContext = React.createContext({});

export const withMoveCrudBvrsContext = (WrappedComponent: any) => (
  props: any
) => {
  return (
    <MoveCrudBvrsContext.Consumer>
      {moveCrudBvrs => (
        <WrappedComponent {...props} moveCrudBvrs={moveCrudBvrs} />
      )}
    </MoveCrudBvrsContext.Consumer>
  );
};

export function createNewMove(
  userProfile: ?UserProfileT,
  sourceMoveListId: UUID
): ?MoveT {
  if (!userProfile) {
    return null;
  }

  return {
    id: uuidv4(),
    slug: newMoveSlug,
    link: "",
    name: "New move",
    description: "",
    startTimeMs: null,
    endTimeMs: null,
    tags: [],
    ownerId: userProfile.userId,
    sourceMoveListId: sourceMoveListId,
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
  sourceMoveListId: UUID,
  setNextHighlightedMoveId: UUID => void,
  highlightedMoveId: UUID,
  insertMovesBvr: InsertMovesBvrT,
  setIsEditing: boolean => void
): NewMoveBvrT {
  function _createNewMove() {
    return createNewMove(userProfile, sourceMoveListId);
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
    moveList ? moveList.id : "",
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
    return movesApi
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
    setHighlightedMoveId: newMoveBvr.setHighlightedItemId,
  };

  return bvrs;
}
