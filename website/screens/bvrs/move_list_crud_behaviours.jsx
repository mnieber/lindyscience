// @flow

import * as React from "react";
import * as moveListsApi from "move_lists/api";

// $FlowFixMe
import uuidv4 from "uuid/v4";
import { newMoveListSlug } from "screens/utils";
import { createErrorHandler } from "app/utils";
import { slugify } from "utils/utils";
import { makeMoveListUrl } from "screens/utils";
import { querySetListToDict } from "utils/utils";
import { browseToMove } from "screens/containers/index";

import {
  useInsertItems,
  useNewItem,
  useSaveItem,
} from "screens/bvrs/crud_behaviours";

import type { DataContainerT } from "screens/containers/data_container";
import type { MoveListT } from "move_lists/types";
import type { MoveListCrudBvrsT } from "screens/types";
import type { UUID } from "kernel/types";
import type { UserProfileT } from "profiles/types";
import type {
  InsertItemsBvrT,
  NewItemBvrT,
  SaveItemBvrT,
} from "screens/bvrs/crud_behaviours";

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
    id: uuidv4(),
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

type IncompleteValuesT = {
  name: string,
};

function _completeMoveList(
  oldMoveList: MoveListT,
  incompleteValues: IncompleteValuesT
): MoveListT {
  // $FlowFixMe
  const newSlug = incompleteValues.name
    ? slugify(incompleteValues.name)
    : undefined;

  return {
    ...oldMoveList,
    ...incompleteValues,
    slug: newSlug || oldMoveList.slug,
  };
}

// NewMoveList Behaviour

export type NewMoveListBvrT = NewItemBvrT<MoveListT>;

export function useNewMoveList(
  userProfile: ?UserProfileT,
  setHighlightedMoveListId: UUID => void,
  highlightedMoveListId: UUID,
  insertMoveListsBvr: InsertMoveListsBvrT,
  setIsEditing: boolean => void
): NewMoveListBvrT {
  function _createNewMoveList() {
    return userProfile
      ? createNewMoveList(userProfile.userId, userProfile.username)
      : undefined;
  }

  return useNewItem<MoveListT>(
    highlightedMoveListId,
    setHighlightedMoveListId,
    insertMoveListsBvr,
    setIsEditing,
    _createNewMoveList
  );
}

export type InsertMoveListsBvrT = InsertItemsBvrT<MoveListT>;

// SaveMoveList Behaviour

export type SaveMoveListBvrT = SaveItemBvrT<MoveListT>;

export function useSaveMoveList(
  moveLists: Array<MoveListT>,
  newMoveListBvr: NewMoveListBvrT,
  setIsEditing: boolean => void,
  updateMoveList: (oldMoveList: MoveListT, newMoveList: MoveListT) => any
): SaveMoveListBvrT {
  function _saveMoveList(id: UUID, incompleteValues: IncompleteValuesT) {
    const oldMoveList = moveLists.find(x => x.id == id);
    if (oldMoveList) {
      const newMoveList = _completeMoveList(oldMoveList, incompleteValues);
      return updateMoveList(oldMoveList, newMoveList);
    }
  }

  return useSaveItem<MoveListT>(newMoveListBvr, setIsEditing, _saveMoveList);
}

export function createMoveListCrudBvrs(
  userProfile: ?UserProfileT,
  moveListsContainer: DataContainerT<MoveListT>,
  selectedMoveListId: UUID,
  setNextSelectedMoveListId: UUID => void,
  actAddMoveLists: Function
): MoveListCrudBvrsT {
  const [isEditing, setIsEditing] = React.useState(false);

  const insertMoveListsBvr = useInsertItems(moveListsContainer);

  const newMoveListBvr: NewMoveListBvrT = useNewMoveList(
    userProfile,
    setNextSelectedMoveListId,
    selectedMoveListId,
    insertMoveListsBvr,
    setIsEditing
  );

  async function _updateMoveList(
    oldMoveList: MoveListT,
    newMoveList: MoveListT
  ) {
    actAddMoveLists(querySetListToDict([newMoveList]));
    await moveListsApi
      .saveMoveList(newMoveList)
      .catch(createErrorHandler("We could not save the movelist"));
    await browseToMove([makeMoveListUrl(newMoveList)], true);
  }

  const saveMoveListBvr: SaveMoveListBvrT = useSaveMoveList(
    moveListsContainer.preview,
    newMoveListBvr,
    setIsEditing,
    _updateMoveList
  );

  const bvrs: MoveListCrudBvrsT = {
    isEditing,
    setIsEditing,
    insertMoveListsBvr,
    newMoveListBvr,
    saveMoveListBvr,
    setHighlightedMoveListId: newMoveListBvr.setHighlightedItemId,
  };

  return bvrs;
}
