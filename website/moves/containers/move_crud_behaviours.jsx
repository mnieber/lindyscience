// @flow

import * as api from 'moves/api'
import { querySetListToDict, slugify, isNone } from 'utils/utils'
import * as React from 'react'
import type { TagT, MoveT, DifficultyT } from 'moves/types'
import type { UUID, UserProfileT, VoteByIdT } from 'app/types';
// $FlowFixMe
import uuidv4 from 'uuid/v4'


// $FlowFixMe
export const MoveCrudBvrsContext = React.createContext({});


// InsertMove Behaviour

export type InsertMoveBvrT = {|
  preview: Array<MoveT>,
  prepare: Function,
  finalize: Function,
  insertDirectly: Function
|};

export function useInsertMove(
  moves: Array<MoveT>,
  actInsertMoves: Function,
  moveListId: UUID,
  createErrorHandler: Function
): InsertMoveBvrT {
  const [targetMoveId, setTargetMoveId] = React.useState("");
  const [sourceMove, setSourceMove] = React.useState(null);

  const preview = !sourceMove
    ? moves
    : moves.reduce(
      (acc, move) => {
        if (move.id != sourceMove.id) {
          acc.push(move);
        }
        if (move.id == targetMoveId) {
          acc.push(sourceMove);
        }
        return acc;
      },
      targetMoveId ? [] : [sourceMove]
    );

  function insertDirectly(
    sourceMoveId: UUID, targetMoveId: UUID, isBefore: boolean
  ) {
    if (isBefore) {
      const idx = moves.findIndex(x => x.id == targetMoveId) - 1;
      targetMoveId = idx < 0 ? "" : moves[idx].id;
    }
    const allMoveIds = actInsertMoves([sourceMoveId], moveListId, targetMoveId);
    api.saveMoveListOrdering(moveListId, allMoveIds)
      .catch(createErrorHandler("We could not update the move list"));
  }

  function prepare(targetMoveId: UUID, move: MoveT) {
    if (move) {
      setSourceMove(move);
      setTargetMoveId(targetMoveId);
    }
  }

  function finalize(isCancel: boolean) {
    const result = targetMoveId;
    if (sourceMove && !isCancel) {
      insertDirectly(sourceMove.id, targetMoveId, false)
    }
    setSourceMove(null);
    setTargetMoveId("");
    return result;
  }

  return {preview, prepare, finalize, insertDirectly};
}


// NewMove Behaviour

export type NewMoveBvrT = {|
  newMove: ?MoveT,
  addNewMove: Function,
  finalize: Function,
  setHighlightedMoveId: Function,
|};

export function _createNewMove(userId: number): MoveT {
  return {
    id: uuidv4(),
    slug: 'new-move',
    name: 'New move',
    description: '',
    difficulty: '',
    tips: [],
    videoLinks: [],
    tags: [],
    ownerId: userId,
    privateData: {},
  };
}

export function useNewMove(
  userProfile: ?UserProfileT,
  highlightedMoveId: UUID,
  setHighlightedMoveId: Function,
  insertMoveBvr: InsertMoveBvrT,
  setEditingEnabled: Function,
  setEditingDisabled: Function,
): NewMoveBvrT {
  const [newMove, setNewMove] = React.useState(null);
  const [nextHighlightedMoveId, setNextHighlightedMoveId] = React.useState(null);

  // Call setHighlightedMoveId with the moveId set in the previous render.
  // This ensures that `newMove` is visible to the whole app.
  if (nextHighlightedMoveId) {
    setNextHighlightedMoveId(null);
    setHighlightedMoveId(nextHighlightedMoveId);
  }

  // Store a new move in the function's state
  function addNewMove() {
    if (userProfile) {
      const newMove = _createNewMove(userProfile.userId);
      setNewMove(newMove);
      insertMoveBvr.prepare(highlightedMoveId, newMove);
      setNextHighlightedMoveId(newMove.id);
      setEditingEnabled();
    }
  }

  // Remove new move from the function's state
  function finalize(isCancel: boolean) {
    setEditingDisabled();
    const targetMoveId = insertMoveBvr.finalize(isCancel);
    if (newMove && isCancel) {
      setNextHighlightedMoveId(targetMoveId);
    }
    setNewMove(null);
  }

  function setHighlightedMoveIdExt(moveId: UUID) {
    // Cancel the new move if the highlight moves elsewhere
    if (newMove && moveId != newMove.id) {
      finalize(true);
    }
    setNextHighlightedMoveId(moveId);
  }

  return {
    newMove,
    addNewMove,
    finalize,
    setHighlightedMoveId: setHighlightedMoveIdExt
  };
}


// SaveMove Behaviour

export type SaveMoveBvrT = {
  saveMove: Function,
  discardChanges: Function,
};

export function useSaveMove(
  moves: Array<MoveT>,
  newMoveBvr: NewMoveBvrT,
  disableEditing: Function,
  actUpdateMoves: Function,
  createErrorHandler: Function,
): SaveMoveBvrT {
  type IncompleteValuesT = {|
    name: string,
    description: string,
    difficulty: DifficultyT,
    tags: Array<TagT>,
  |};

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

  function saveMove(id: UUID, incompleteValues: IncompleteValuesT) {
    const move = _completeMove(id, incompleteValues);
    actUpdateMoves([move]);
    newMoveBvr.finalize(false);
    disableEditing();

    const isNewMove = !!newMoveBvr.newMove && newMoveBvr.newMove.id == id;
    return api.saveMove(isNewMove, move)
      .catch(createErrorHandler('We could not save the move'));
  }

  function discardChanges() {
    newMoveBvr.finalize(true);
    disableEditing();
  }

  return {saveMove, discardChanges};
}
