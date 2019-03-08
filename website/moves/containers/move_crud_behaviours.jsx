// @flow

import * as React from 'react'
import * as api from 'moves/api'

// $FlowFixMe
import uuidv4 from 'uuid/v4'
import { createErrorHandler } from 'app/utils'
import { newMoveSlug, findMoveBySlugid } from 'moves/utils'
import { slugify } from 'utils/utils'

import {
  useInsertItem, useNewItem, useSaveItem
} from 'moves/containers/crud_behaviours'

import type { MoveT, MoveListT, DifficultyT, MoveCrudBvrsT } from 'moves/types'
import type { UUID, UserProfileT, VoteByIdT, SlugidT } from 'app/types';
import type {
  InsertItemBvrT, NewItemBvrT, SaveItemBvrT
} from 'moves/containers/crud_behaviours'


// $FlowFixMe
export const MoveCrudBvrsContext = React.createContext({});


export function createNewMove(userProfile: ?UserProfileT): ?MoveT {
  if (!userProfile) {
    return null;
  }

  return {
    id: uuidv4(),
    slug: newMoveSlug,
    name: 'New move',
    description: '',
    difficulty: '',
    tips: [],
    videoLinks: [],
    tags: [],
    ownerId: userProfile.userId,
    privateData: null,
  };
}


// InsertMove Behaviour

export type InsertMoveBvrT = InsertItemBvrT<MoveT>;

export function useInsertMove(
  moves: Array<MoveT>,
  actInsertMoves: Function,
  moveListId: UUID,
  createErrorHandler: Function
): InsertMoveBvrT {
  function _insertMove(move: MoveT, targetMoveId: UUID) {
    const allMoveIds = actInsertMoves([move.id], moveListId, targetMoveId);
    api.saveMoveOrdering(moveListId, allMoveIds)
      .catch(createErrorHandler("We could not update the move list"));
  }

  return useInsertItem<MoveT>(moves, _insertMove);
}


// NewMove Behaviour

export type NewMoveBvrT = NewItemBvrT<MoveT>;

export function useNewMove(
  userProfile: ?UserProfileT,
  setHighlightedMoveId: Function,
  highlightedMoveId: UUID,
  insertMoveBvr: InsertMoveBvrT,
  setIsEditing: Function,
): NewMoveBvrT {
  function _createNewMove() {
    return createNewMove(userProfile);
  }

  return useNewItem<MoveT>(
    highlightedMoveId,
    setHighlightedMoveId,
    insertMoveBvr,
    setIsEditing,
    _createNewMove,
  );
}


// SaveMove Behaviour

export type SaveMoveBvrT = SaveItemBvrT<MoveT>;

export function useSaveMove(
  moves: Array<MoveT>,
  newMoveBvr: NewMoveBvrT,
  setIsEditing: Function,
  updateMove: Function,
  createErrorHandler: Function,
): SaveMoveBvrT {
  type IncompleteValuesT = {
    name: string,
  };

  function _completeMove(oldMove: MoveT, incompleteValues: IncompleteValuesT): MoveT {
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
    // $FlowFixMe
    const oldMove: MoveT = moves.find(x => x.id == id);
    const newMove = _completeMove(oldMove, incompleteValues);
    updateMove(oldMove, newMove);
    return api.saveMove(newMove)
      .catch(createErrorHandler('We could not save the move'));
  }

  return useSaveItem<MoveT>(newMoveBvr, setIsEditing, _saveMove);
}


export function createMoveCrudBvrs(
  moves: Array<MoveT>,
  moveList: ?MoveListT,
  userProfile: UserProfileT,
  highlightedMoveSlugid: SlugidT,
  setNextHighlightedMoveId: Function,
  updateMove: Function,
  actInsertMoves: Function,
): MoveCrudBvrsT {
  const highlightedMoveInStore = findMoveBySlugid(
    moves, highlightedMoveSlugid
  );

  const [isEditing, setIsEditing] = React.useState(false);

  const insertMoveBvr: InsertMoveBvrT = useInsertMove(
    moves,
    actInsertMoves,
    moveList ? moveList.id : "",
    createErrorHandler
  );

  const newMoveBvr: NewMoveBvrT = useNewMove(
    userProfile,
    setNextHighlightedMoveId,
    highlightedMoveInStore ? highlightedMoveInStore.id : "",
    insertMoveBvr,
    setIsEditing,
  );

  const saveMoveBvr: SaveMoveBvrT = useSaveMove(
    insertMoveBvr.preview,
    newMoveBvr,
    setIsEditing,
    updateMove,
    createErrorHandler
  );

  const bvrs: MoveCrudBvrsT = {
    isEditing,
    setIsEditing,
    insertMoveBvr,
    newMoveBvr,
    saveMoveBvr
  };

  return bvrs;
}
