// @flow

import * as React from "react";

import { makeMoveListUrl, newMoveListSlug } from "screens/utils";
import { querySetListToDict, slugify } from "utils/utils";
import * as moveListsApi from "move_lists/api";
import { createErrorHandler } from "app/utils";
import { create_uuid } from "utils/utils";
import { type EditItemBvrT, useEditItem } from "screens/bvrs/crud_behaviours";

import type { DataContainerT } from "screens/containers/data_container";
import type { MoveListT } from "move_lists/types";
import type { MoveListCrudBvrsT } from "screens/types";
import type { UUID } from "kernel/types";
import type { UserProfileT } from "profiles/types";

// $FlowFixMe
export const MoveListCrudBvrsContext = React.createContext({});

export const withMoveListCrudBvrsContext = (WrappedComponent: any) => (
  props: any
) => {
  return (
    <MoveListCrudBvrsContext.Consumer>
      {moveListCrudBvrs => (
        <WrappedComponent {...props} moveListCrudBvrs={moveListCrudBvrs} />
      )}
    </MoveListCrudBvrsContext.Consumer>
  );
};

export function createNewMoveList(userId: number, username: string): MoveListT {
  return {
    id: create_uuid(),
    slug: newMoveListSlug,
    name: "New move list",
    description: "",
    isPrivate: false,
    role: "",
    tags: [],
    moves: [],
    ownerId: userId,
    ownerUsername: username,
  };
}

export type EditMoveListBvrT = EditItemBvrT<MoveListT>;

export function createMoveListCrudBvrs(
  userProfile: ?UserProfileT,
  selectedMoveListId: UUID,
  setNextSelectedMoveListId: UUID => void,
  moveListContainer: DataContainerT<MoveListT>,
  browseToMoveList: MoveListT => void,
  actAddMoveLists: Function,
  isEditingMoveList: boolean,
  actSetIsEditingMoveList: Function
): MoveListCrudBvrsT {
  function _createNewMoveList() {
    return userProfile
      ? createNewMoveList(userProfile.userId, userProfile.username)
      : undefined;
  }

  function saveMoveList(moveList: MoveListT, values: any): MoveListT {
    const slug =
      values.slug == newMoveListSlug ? slugify(values.name) : values.slug;

    const newMoveList = {
      ...moveList,
      ...values,
      slug,
    };

    actAddMoveLists(querySetListToDict([newMoveList]));
    browseToMoveList(newMoveList);

    moveListsApi
      .saveMoveList(newMoveList)
      .catch(createErrorHandler("We could not save the movelist"));

    return newMoveList;
  }

  const editMoveListBvr = useEditItem<MoveListT>(
    selectedMoveListId,
    setNextSelectedMoveListId,
    moveListContainer,
    actSetIsEditingMoveList,
    _createNewMoveList,
    saveMoveList
  );

  const bvrs: MoveListCrudBvrsT = {
    isEditing: isEditingMoveList,
    setIsEditing: actSetIsEditingMoveList,
    editMoveListBvr,
    setHighlightedMoveListId: editMoveListBvr.setHighlightedItemId,
  };

  return bvrs;
}
