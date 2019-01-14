// @flow

import * as actions from 'moves/actions'
import * as data from 'moves/tests/data'
import * as fromStore from 'moves/reducers'
import { reducer } from 'app/store'
import { test } from 'tape'
import { Thunk, FlushThunks } from 'redux-testkit';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { _createNewMove } from 'moves/containers/movespage'

test('test actCastVote', function (t) {
  const id = "759b488d-ffa4-467c-8157-6ca27114bda9";

  const dispatches = Thunk(actions.actCastVote)
    .withState(data.state)
    .execute(id, 1);
  t.deepEqual(dispatches[0].getAction(), {
    type: "CAST_VOTE",
    id: id,
    vote: 1,
    prevVote: -1,
  });

  t.end();
});

function _setUp() {
  const flushThunks = FlushThunks.createMiddleware();
  const store = createStore(
    reducer,
    data.state,
    applyMiddleware(flushThunks, thunk)
  );
  return {store};
}

test('test actSetMoveListFilter', function (t) {
  const {store} = _setUp();
  store.dispatch(
    actions.actSetHighlightedMoveId("18561d09-0727-441d-bdd9-d3d8c33ebde3")
  );

  store.dispatch(actions.actSetMoveListFilter(['fun'], true));
  t.equal(
    store.getState().moves.selection.highlightedMoveId,
    "3ba5ed84-34d5-442c-921c-50da0dc022da",
  );

  // change filter, do not update highlighted move
  store.dispatch(actions.actSetMoveListFilter(["foo"], false));
  t.equal(
    store.getState().moves.selection.highlightedMoveId,
    "3ba5ed84-34d5-442c-921c-50da0dc022da",
  );

  // change filter, update highlighted move
  store.dispatch(actions.actSetMoveListFilter(["swing out"], true));
  t.equal(
    store.getState().moves.selection.highlightedMoveId,
    "18561d09-0727-441d-bdd9-d3d8c33ebde3",
  );

  t.end();
});

test('test actInsertMoves', function (t) {
  const {store} = _setUp();
  const newMoves = [_createNewMove(), _createNewMove()];
  const newMoveIds = newMoves.map(x => x.id);

  store.dispatch(actions.actUpdateMoves(newMoves));
  const moveIdsInList = store.dispatch(
    actions.actInsertMoves(
      newMoveIds,
      data.moveList1.id,
      ""
    )
  );

  t.deepEqual(
    moveIdsInList.sort(),
    [...data.moveList1.moves, ...newMoveIds].sort()
  )
  t.end();
});

test('test actSelectMoveListById', function (t) {
  const {store} = _setUp();

  const moveId = "b95df10a-cbe2-4ec4-9a03-1b61c5452e9d";
  store.dispatch(actions.actSetHighlightedMoveId(moveId));
  t.equal(fromStore.getHighlightedMoveId(store.getState().moves), moveId);
  store.dispatch(actions.actSelectMoveListById(data.moveList2.id));
  t.equal(store.getState().moves.selection.moveListId, data.moveList2.id);

  t.end();
});
