// @flow

import * as actions from 'moves/actions'
import * as api from 'moves/api'
import * as fromStore from 'moves/reducers'
import * as React from 'react'
import type { FlagT } from 'utils/hooks'
import type { MoveListT, VideoLinksByIdT, TagT, MoveT, DifficultyT } from 'moves/types'
import type { UUID } from 'app/types';
// $FlowFixMe
import uuidv4 from 'uuid/v4'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { createErrorHandler } from 'utils/utils'
import { EditableMove } from 'moves/presentation/move'
import { MoveList } from 'moves/presentation/movelist';
import { MoveListFilter, MoveListPicker } from 'moves/presentation/movelist_filter';
import { MoveListHeader } from 'moves/presentation/movelist_header';
import { querySetListToDict, slugify, isNone } from 'utils/utils'
import { toastr } from 'react-redux-toastr'
import { useFlag } from 'utils/hooks'
import { useRef } from 'react'


// InsertMove Behaviour

type InsertMoveBvrT = {|
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

type NewMoveBvrT = {|
  newMove: ?MoveT,
  addNewMove: Function,
  finalize: Function,
  setHighlightedMoveId: Function,
|};

export function _createNewMove(): MoveT {
  return {
    id: uuidv4(),
    slug: 'new-move',
    name: 'New move',
    description: '',
    difficulty: '',
    tips: [],
    videoLinks: [],
    tags: [],
    owner: 1, // TODO
    privateData: {},
  };
}

export function useNewMove(
  highlightedMoveId: UUID,
  setHighlightedMoveId: Function,
  insertMoveBvr: InsertMoveBvrT,
  setEditingEnabled: Function,
  setEditingDisabled: Function,
): NewMoveBvrT {
  const [newMove, setNewMove] = React.useState(null);

  // Store a new move in the function's state
  function addNewMove() {
    const newMove = _createNewMove();
    setNewMove(newMove);
    setHighlightedMoveId(newMove.id);
    insertMoveBvr.prepare(highlightedMoveId, newMove);
    setEditingEnabled();
  }

  // Remove new move from the function's state
  function finalize(isCancel: boolean) {
    setEditingDisabled();
    const targetMoveId = insertMoveBvr.finalize(isCancel);
    if (newMove && isCancel) {
      setHighlightedMoveId(targetMoveId);
    }
    setNewMove(null);
  }

  function setHighlightedMoveIdExt(id: UUID) {
    // Cancel the new move if the highlight moves elsewhere
    if (newMove && id != newMove.id) {
      finalize(true);
    }
    setHighlightedMoveId(id);
  }

  return {
    newMove,
    addNewMove,
    finalize,
    setHighlightedMoveId: setHighlightedMoveIdExt
  };
}


// SaveMove Behaviour

type SaveMoveBvrT = {
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


// MovesPage

type HandlersT = {
  onDrop: Function,
  onKeyDown: Function,
};

function createHandlers(
  newMoveBvr: NewMoveBvrT,
  insertMoveBvr: InsertMoveBvrT,
  saveMoveBvr: SaveMoveBvrT,
  moveListRef: any,
  isEditing: FlagT,
): HandlersT {
  const onDrop = (sourceMoveId, targetMoveId, isBefore) => {
    if (newMoveBvr.newMove?.id != sourceMoveId) {
      insertMoveBvr.insertDirectly(sourceMoveId, targetMoveId, isBefore);
    }
  }

  const onKeyDown = (e) => {
    const edit_e = 69;
    if(e.ctrlKey && [edit_e].indexOf(e.keyCode) > -1) {
      e.preventDefault();
      e.stopPropagation();
      if (isEditing.flag) {
        saveMoveBvr.discardChanges();
        if (moveListRef.current) {
          moveListRef.current.focus();
        }
      }
      else {
        isEditing.setTrue();
      }
    }
  }

  return {
    onDrop,
    onKeyDown
  }
}

export type MovesPagePropsT = {
  videoLinksByMoveId: VideoLinksByIdT,
  moves: Array<MoveT>,
  moveTags: Array<TagT>,
  moveLists: Array<MoveListT>,
  moveListId: UUID,
  actSelectMoveListById: Function,
  highlightedMoveId: UUID,
  actSetHighlightedMoveId: Function,
  actSetMoveListFilter: Function,
  actInsertMoves: Function,
  actUpdateMoves: Function,
};

function MovesPage(props: MovesPagePropsT) {
  const isEditing = useFlag(false);

  const insertMoveBvr: InsertMoveBvrT = useInsertMove(
    props.moves,
    props.actInsertMoves,
    props.moveListId,
    createErrorHandler
  );

  const newMoveBvr: NewMoveBvrT = useNewMove(
    props.highlightedMoveId,
    props.actSetHighlightedMoveId,
    insertMoveBvr,
    isEditing.setTrue,
    isEditing.setFalse,
  );

  const saveMoveBvr = useSaveMove(
    insertMoveBvr.preview,
    newMoveBvr,
    isEditing.setFalse,
    props.actUpdateMoves,
    createErrorHandler
  );

  const moveListRef = useRef(null);

  const handlers: HandlersT = createHandlers(
    newMoveBvr,
    insertMoveBvr,
    saveMoveBvr,
    moveListRef,
    isEditing,
  );

  const moveListPanelNodes = function() {
    return (
      <React.Fragment>
        <MoveListPicker
          className="mb-4"
          moveLists={props.moveLists}
          defaultMoveListId={props.moveListId}
          selectMoveListById={props.actSelectMoveListById}
        />
        <MoveListHeader
          addNewMove={newMoveBvr.addNewMove}
          className="py-4"
        />
        <MoveListFilter
          className="mb-4"
          setMoveListFilter={props.actSetMoveListFilter}
          moveTags={props.moveTags}
        />
        <MoveList
          ref={moveListRef}
          className=""
          videoLinksByMoveId={props.videoLinksByMoveId}
          setHighlightedMoveId={newMoveBvr.setHighlightedMoveId}
          moves={insertMoveBvr.preview}
          highlightedMoveId={props.highlightedMoveId}
          onDrop={handlers.onDrop}
        />
      </React.Fragment>
    );
  }();

  const highlightedMove = insertMoveBvr.preview.find(m => (m.id == props.highlightedMoveId));
  const moveDiv = highlightedMove
    ? <EditableMove
        move={highlightedMove}
        key={highlightedMove.id}
        saveMove={saveMoveBvr.saveMove}
        cancelEditMove={saveMoveBvr.discardChanges}
        moveTags={props.moveTags}
        isEditing={isEditing.flag}
        setEditingEnabled={isEditing.setTrue}
      />
    : <div className="noMoveHighlighted">No move highlighted</div>

  return (
    <div
      className="movesPage flexrow"
      onKeyDown={handlers.onKeyDown}
    >
      <div className="moveListPanel w-1/5 flexcol">
        {moveListPanelNodes}
      </div>
      <div className="movePanel pl-4 w-4/5">
        {moveDiv}
      </div>
    </div>
  );
}

// $FlowFixMe
MovesPage = connect(
  (state) => ({
    videoLinksByMoveId: fromStore.getVideoLinksByMoveId(state.moves),
    moves: fromStore.getFilteredMovesInList(state.moves),
    moveLists: fromStore.getMoveLists(state.moves),
    moveTags: fromStore.getMoveTags(state.moves),
    highlightedMoveId: fromStore.getHighlightedMoveId(state.moves),
    moveListId: fromStore.getSelectedMoveListId(state.moves),
  }),
  actions
)(MovesPage)

export default MovesPage;
