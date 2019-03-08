// @flow

import * as api from 'moves/api'
import { newMoveSlug } from 'moves/utils'
import { slugify } from 'utils/utils'
import * as React from 'react'
import {
  useInsertItem, useNewItem, useSaveItem
} from 'moves/containers/crud_behaviours'
// $FlowFixMe
import uuidv4 from 'uuid/v4'
import type { MoveT, MoveListT, DifficultyT } from 'moves/types'
import type { UUID, UserProfileT, VoteByIdT } from 'app/types';
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
  actAddMoves: Function,
  createErrorHandler: Function,
): SaveMoveBvrT {
  type IncompleteValuesT = {
    name: string,
  };

  function _completeMove(id: UUID, incompleteValues: IncompleteValuesT): MoveT {
    // $FlowFixMe
    const move: MoveT = moves.find(x => x.id == id);
    const newSlug = incompleteValues.name
      ? slugify(incompleteValues.name)
      : undefined;

    return {
      ...move,
      ...incompleteValues,
      slug: newSlug || move.slug,
    };
  }

  function _saveMove(id: UUID, incompleteValues: IncompleteValuesT) {
    newMoveBvr.setHighlightedItemId(id);
    const move = _completeMove(id, incompleteValues);
    actAddMoves([move]);
    return api.saveMove(move)
      .catch(createErrorHandler('We could not save the move'));
  }

  return useSaveItem<MoveT>(moves, newMoveBvr, setIsEditing, _saveMove);
}
