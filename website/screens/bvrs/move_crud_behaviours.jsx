// @flow

import * as React from "react";

import { create_uuid, slugify } from "utils/utils";
import { type EditItemBvrT, useEditItem } from "screens/bvrs/crud_behaviours";
import * as api from "screens/api";
import * as movesApi from "moves/api";
import { createErrorHandler } from "app/utils";
import { newMoveSlug } from "moves/utils";
import type { DataContainerT } from "screens/containers/data_container";
import type { MoveListT } from "move_lists/types";
import type { MoveCrudBvrsT } from "screens/types";
import type { MoveT } from "moves/types";
import type { UUID } from "kernel/types";
import type { UserProfileT } from "profiles/types";

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
    id: create_uuid(),
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
    const slug =
      values.slug == newMoveSlug ? slugify(values.name) : values.slug;

    const newMove = {
      ...move,
      ...values,
      slug,
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
