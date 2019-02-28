// @flow

import * as actions from 'moves/actions'
import * as data from 'moves/tests/data'
import * as fromStore from 'moves/reducers'
import { getObjectValues } from 'utils/utils'
import { reducer } from 'app/store'
import { test } from 'tape'
import { Thunk, FlushThunks } from 'redux-testkit';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { _createNewMove } from 'moves/containers/move_crud_behaviours'

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
    actions.actSelectMoveListByUrl('mnieber', 'moves')
  );
  store.dispatch(
    actions.actSetHighlightedMoveBySlug('three-wall-swing-out')
  );

  t.equal(
    store.dispatch(actions.actSetMoveListFilter(['fun'])),
    "basket-whip",
  );

  // change filter, do not update highlighted move
  t.equal(
    store.dispatch(actions.actSetMoveListFilter(["foo"])),
    "",
  );

  // change filter, update highlighted move
  t.equal(
    store.dispatch(actions.actSetMoveListFilter(["swing out"])),
    "three-wall-swing-out",
  );

  t.end();
});

test.only('test actSetMoveListFilter with duplicate slugs', function (t) {
  const {store} = _setUp();

  const swingOut = getObjectValues(data.moves)[0];
  swingOut.slug = getObjectValues(data.moves)[1].slug;

  store.dispatch(
    actions.actSetHighlightedMoveBySlug(swingOut.slug)
  );

  t.equal(
    store.dispatch(actions.actSetMoveListFilter(['fun'])),
    "basket-whip/3ba5ed84-34d5-442c-921c-50da0dc022da",
    "Since the slug is duplicated, the slugid should contain the id"
  );

  t.end();
});

test('test actInsertMoves', function (t) {
  const {store} = _setUp();
  const newMoves = [_createNewMove(data.profile1.userId), _createNewMove(data.profile1.userId)];
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

test('test actSelectMoveListByUrl', function (t) {
  const {store} = _setUp();

  store.dispatch(actions.actSelectMoveListByUrl('mnieber', 'moves'));
  const moveList = fromStore.getSelectedMoveList(store.getState().moves);
  t.equal(
    !!moveList && moveList.id, data.moveList1.id
  );

  t.end();
});
