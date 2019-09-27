// @flow

import * as React from "react";
import * as api from "screens/api";
import * as movesApi from "moves/api";

// $FlowFixMe
import uuidv4 from "uuid/v4";
import { createErrorHandler } from "app/utils";
import { newMoveSlug } from "moves/utils";
import { slugify } from "utils/utils";

import { useEditItem } from "screens/bvrs/crud_behaviours";

import type { DataContainerT } from "screens/containers/data_container";
import type { MoveListT } from "move_lists/types";
import type { MoveCrudBvrsT } from "screens/types";
import type { MoveT } from "moves/types";
import type { UUID } from "kernel/types";
import type { UserProfileT } from "profiles/types";
import type { EditItemBvrT } from "screens/bvrs/crud_behaviours";

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

// NewMove Behaviour

export type EditMoveBvrT = EditItemBvrT<MoveT>;

export function createMoveCrudBvrs(
  moveList: ?MoveListT,
  userProfile: UserProfileT,
  highlightedMoveId: UUID,
  setNextHighlightedMoveId: UUID => void,
  moveContainer: DataContainerT<MoveT>,
  browseToMove: MoveT => void,
  actAddMoves: Function,
  isEditingMove: boolean,
  actSetIsEditingMove: Function
): MoveCrudBvrsT {
  function _createNewMove() {
    return createNewMove(userProfile, moveList ? moveList.id : "");
  }

  function saveMove(move: MoveT, values: any) {
    const newSlug = values.name ? slugify(values.name) : undefined;

    const newMove = {
      ...move,
      ...values,
      slug: newSlug || move.slug,
    };

    actAddMoves([newMove]);
    browseToMove(newMove);

    return movesApi
      .saveMove(newMove)
      .catch(createErrorHandler("We could not save the move"));
  }

  const editMoveBvr = useEditItem<MoveT>(
    highlightedMoveId,
    setNextHighlightedMoveId,
    moveContainer,
    actSetIsEditingMove,
    _createNewMove,
    saveMove
  );

  const bvrs: MoveCrudBvrsT = {
    isEditing: isEditingMove,
    setIsEditing: actSetIsEditingMove,
    editMoveBvr,
    setHighlightedMoveId: editMoveBvr.setHighlightedItemId,
  };

  return bvrs;
}
