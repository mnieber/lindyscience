// @flow

import * as React from 'react'
import * as api from 'moves/api'

// $FlowFixMe
import uuidv4 from 'uuid/v4'
import { findMoveListByUrl, newMoveListSlug } from 'moves/utils'
import { createErrorHandler } from 'app/utils'
import { slugify, querySetListToDict } from 'utils/utils'

import {
  useInsertItem, useNewItem, useSaveItem
} from 'moves/containers/crud_behaviours'

import type {
  MoveListT, DifficultyT, MoveListCrudBvrsT, MoveListByIdT
} from 'moves/types'
import type { UUID, UserProfileT, VoteByIdT } from 'app/types';
import type {
  InsertItemBvrT, NewItemBvrT, SaveItemBvrT
} from 'moves/containers/crud_behaviours'


// $FlowFixMe
export const MoveListCrudBvrsContext = React.createContext({});


export function createNewMoveList(userProfile: ?UserProfileT): ?MoveListT {
  if (!userProfile) {
    return null;
  }

  return {
    id: uuidv4(),
    slug: newMoveListSlug,
    name: 'New move list',
    description: '',
    tags: [],
    moves: [],
    ownerId: userProfile.userId,
    ownerUsername: userProfile.username,
  };
}


// InsertMoveList Behaviour

export type InsertMoveListBvrT = InsertItemBvrT<MoveListT>;

export function useInsertMoveList(
  moveLists: Array<MoveListT>,
  actInsertMoveLists: (moveListIds: Array<UUID>, targetMoveListId: UUID) => Array<UUID>,
): InsertMoveListBvrT {
  function _insertMoveList(moveListId: UUID, targetMoveListId: UUID) {
    const allMoveListIds = actInsertMoveLists([moveListId], targetMoveListId);
    api.saveMoveListOrdering(allMoveListIds)
      .catch(createErrorHandler("We could not update the move list"));
  }

  return useInsertItem<MoveListT>(moveLists, _insertMoveList);
}


// NewMoveList Behaviour

export type NewMoveListBvrT = NewItemBvrT<MoveListT>;

export function useNewMoveList(
  userProfile: ?UserProfileT,
  setHighlightedMoveListId: (UUID) => void,
  highlightedMoveListId: UUID,
  insertMoveListBvr: InsertMoveListBvrT,
  setIsEditing: (boolean) => void,
): NewMoveListBvrT {
  function _createNewMoveList() {
    return createNewMoveList(userProfile);
  }

  return useNewItem<MoveListT>(
    highlightedMoveListId,
    setHighlightedMoveListId,
    insertMoveListBvr,
    setIsEditing,
    _createNewMoveList,
  );
}


// SaveMoveList Behaviour

export type SaveMoveListBvrT = SaveItemBvrT<MoveListT>;

export function useSaveMoveList(
  movelists: Array<MoveListT>,
  newMoveListBvr: NewMoveListBvrT,
  setIsEditing: (boolean) => void,
  actAddMoveLists: (MoveListByIdT) => void,
): SaveMoveListBvrT {
  type IncompleteValuesT = {
    name: string,
  };

  function _completeMoveList(id: UUID, incompleteValues: IncompleteValuesT): MoveListT {
    // $FlowFixMe
    const movelist: MoveListT = movelists.find(x => x.id == id);
    const newSlug = incompleteValues.name
      ? slugify(incompleteValues.name)
      : undefined;

    return {
      ...movelist,
      ...incompleteValues,
      slug: newSlug || movelist.slug,
    };
  }

  function _saveMoveList(id: UUID, incompleteValues: IncompleteValuesT) {
    const movelist = _completeMoveList(id, incompleteValues);
    actAddMoveLists(querySetListToDict([movelist]));
    return api.saveMoveList(movelist)
      .catch(createErrorHandler('We could not save the movelist'));
  }

  return useSaveItem<MoveListT>(newMoveListBvr, setIsEditing, _saveMoveList);
}


export function createMoveListCrudBvrs(
  userProfile: ?UserProfileT,
  moveLists: Array<MoveListT>,
  selectedMoveListUrl: string,
  actAddMoveLists: (MoveListByIdT) => void,
  actInsertMoveLists: (moveListIds: Array<UUID>, targetMoveListId: UUID) => Array<UUID>,
  setNextSelectedMoveListId: (UUID) => void,
): MoveListCrudBvrsT {
  const [isEditing, setIsEditing] = React.useState(false);

  const moveList = findMoveListByUrl(moveLists, selectedMoveListUrl);

  const insertMoveListBvr: InsertMoveListBvrT = useInsertMoveList(
    moveLists,
    actInsertMoveLists
  );

  const newMoveListBvr: NewMoveListBvrT = useNewMoveList(
    userProfile,
    setNextSelectedMoveListId,
    moveList ? moveList.id : "",
    insertMoveListBvr,
    setIsEditing,
  );

  const saveMoveListBvr: SaveMoveListBvrT = useSaveMoveList(
    insertMoveListBvr.preview,
    newMoveListBvr,
    setIsEditing,
    actAddMoveLists
  );

  const bvrs: MoveListCrudBvrsT = {
    isEditing,
    setIsEditing,
    insertMoveListBvr,
    newMoveListBvr,
    saveMoveListBvr
  };

  return bvrs;
}
