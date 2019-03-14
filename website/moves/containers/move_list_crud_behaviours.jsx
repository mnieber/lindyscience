// @flow

import * as React from 'react'
import * as api from 'moves/api'

// $FlowFixMe
import uuidv4 from 'uuid/v4'
import { findMoveListByUrl, newMoveListSlug } from 'moves/utils'
import { createErrorHandler } from 'app/utils'
import { slugify } from 'utils/utils'

import {
  useInsertItems, useNewItem, useSaveItem
} from 'moves/containers/crud_behaviours'

import type {
  MoveListT, MoveListCrudBvrsT, MoveListByIdT
} from 'moves/types'
import type { UUID, UserProfileT, VoteByIdT } from 'app/types';
import type {
  InsertItemsBvrT, NewItemBvrT, SaveItemBvrT
} from 'moves/containers/crud_behaviours'


// $FlowFixMe
export const MoveListCrudBvrsContext = React.createContext({});


export function createNewMoveList(userId: number, username: string): MoveListT {
  return {
    id: uuidv4(),
    slug: newMoveListSlug,
    name: 'New move list',
    description: '',
    tags: [],
    moves: [],
    ownerId: userId,
    ownerUsername: username,
  };
}


// InsertMoveLists Behaviour

export type InsertMoveListsBvrT = InsertItemsBvrT<MoveListT>;

export function useInsertMoveLists(
  moveLists: Array<MoveListT>,
  actInsertMoveLists: (moveListIds: Array<UUID>, targetMoveListId: UUID) => Array<UUID>,
): InsertMoveListsBvrT {
  function _insertMoveListIds(moveListIds: Array<UUID>, targetMoveListId: UUID) {
    const allMoveListIds = actInsertMoveLists(moveListIds, targetMoveListId);
    api.saveMoveListOrdering(allMoveListIds)
      .catch(createErrorHandler("We could not update the move list"));
  }

  return useInsertItems<MoveListT>(moveLists, _insertMoveListIds);
}


// NewMoveList Behaviour

export type NewMoveListBvrT = NewItemBvrT<MoveListT>;

export function useNewMoveList(
  userProfile: ?UserProfileT,
  setHighlightedMoveListId: (UUID) => void,
  highlightedMoveListId: UUID,
  insertMoveListsBvr: InsertMoveListsBvrT,
  setIsEditing: (boolean) => void,
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
    _createNewMoveList,
  );
}


// SaveMoveList Behaviour

export type SaveMoveListBvrT = SaveItemBvrT<MoveListT>;

export function useSaveMoveList(
  moveLists: Array<MoveListT>,
  newMoveListBvr: NewMoveListBvrT,
  setIsEditing: (boolean) => void,
  updateMoveList: (oldMoveList: MoveListT, newMoveList: MoveListT) => any,
): SaveMoveListBvrT {
  type IncompleteValuesT = {
    name: string,
  };

  function _completeMoveList(oldMoveList: MoveListT, incompleteValues: IncompleteValuesT): MoveListT {
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

  function _saveMoveList(id: UUID, incompleteValues: IncompleteValuesT) {
    const oldMoveList = moveLists.find(x => x.id == id);
    if (oldMoveList) {
      const newMoveList = _completeMoveList(oldMoveList, incompleteValues);
      updateMoveList(oldMoveList, newMoveList);
      return api.saveMoveList(newMoveList)
        .catch(createErrorHandler('We could not save the movelist'));
    }
  }

  return useSaveItem<MoveListT>(newMoveListBvr, setIsEditing, _saveMoveList);
}


export function createMoveListCrudBvrs(
  moveLists: Array<MoveListT>,
  userProfile: ?UserProfileT,
  selectedMoveListUrl: string,
  setNextSelectedMoveListId: (UUID) => void,
  updateMoveList: (oldMoveList: MoveListT, newMoveList: MoveListT) => any,
  actInsertMoveLists: (moveListIds: Array<UUID>, targetMoveListId: UUID) => Array<UUID>,
): MoveListCrudBvrsT {
  const [isEditing, setIsEditing] = React.useState(false);

  const moveList = findMoveListByUrl(moveLists, selectedMoveListUrl);

  const insertMoveListsBvr: InsertMoveListsBvrT = useInsertMoveLists(
    moveLists,
    actInsertMoveLists
  );

  const newMoveListBvr: NewMoveListBvrT = useNewMoveList(
    userProfile,
    setNextSelectedMoveListId,
    moveList ? moveList.id : "",
    insertMoveListsBvr,
    setIsEditing,
  );

  const saveMoveListBvr: SaveMoveListBvrT = useSaveMoveList(
    insertMoveListsBvr.preview,
    newMoveListBvr,
    setIsEditing,
    updateMoveList,
  );

  const bvrs: MoveListCrudBvrsT = {
    isEditing,
    setIsEditing,
    insertMoveListsBvr,
    newMoveListBvr,
    saveMoveListBvr
  };

  return bvrs;
}
