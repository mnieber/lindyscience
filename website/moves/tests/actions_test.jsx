// @flow

import * as actions from "moves/actions";
import * as data from "moves/tests/data";
import * as fromStore from "moves/reducers";
import { getObjectValues } from "utils/utils";
import { createTagsAndKeywordsFilter } from "moves/utils";
import { reducer } from "app/root_reducer";
import { test } from "tape";
import { Thunk, FlushThunks } from "redux-testkit";
import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { createNewMove } from "moves/containers/move_crud_behaviours";

function _setUp() {
  const flushThunks = FlushThunks.createMiddleware();
  const store = createStore(
    reducer,
    data.state,
    applyMiddleware(flushThunks, thunk)
  );
  return { store };
}

test("test actSetMoveListFilter", function(t) {
  const { store } = _setUp();
  store.dispatch(actions.actSetSelectedMoveListUrl("mnieber", "moves"));
  store.dispatch(actions.actSetHighlightedMoveBySlug("three-wall-swing-out"));

  t.equal(
    store.dispatch(
      actions.actSetMoveFilter(
        "tagsAndKeywords",
        createTagsAndKeywordsFilter(["fun"], [])
      )
    ),
    "basket-whip"
  );
  store.dispatch(actions.actSetHighlightedMoveBySlug("basket-whip"));

  // change filter, update highlighted move
  t.equal(
    store.dispatch(
      actions.actSetMoveFilter(
        "tagsAndKeywords",
        createTagsAndKeywordsFilter(["swing out"], [])
      )
    ),
    "three-wall-swing-out"
  );
  store.dispatch(actions.actSetHighlightedMoveBySlug("three-wall-swing-out"));

  // change filter, do not update highlighted move
  t.equal(
    store.dispatch(
      actions.actSetMoveFilter(
        "tagsAndKeywords",
        createTagsAndKeywordsFilter(["foo"], [])
      )
    ),
    ""
  );

  t.end();
});

test("test actSetMoveListFilter with duplicate slugs", function(t) {
  const { store } = _setUp();

  const swingOut = getObjectValues(data.moves)[0];
  swingOut.slug = getObjectValues(data.moves)[1].slug;
  store.dispatch(actions.actAddMoves([swingOut]));

  store.dispatch(actions.actSetHighlightedMoveBySlug(swingOut.slug));

  t.equal(
    store.dispatch(
      actions.actSetMoveFilter(
        "tagsAndKeywords",
        createTagsAndKeywordsFilter(["fun"], [])
      )
    ),
    "basket-whip/3ba5ed84-34d5-442c-921c-50da0dc022da",
    "Since the slug is duplicated, the slugid should contain the id"
  );

  t.end();
});

test("test actInsertMoves", function(t) {
  const { store } = _setUp();
  const move1 = createNewMove(data.profile1);
  const move2 = createNewMove(data.profile1);
  if (move1 && move2) {
    const newMoves = [move1, move2];
    const newMoveIds = newMoves.map(x => x.id);

    store.dispatch(actions.actAddMoves(newMoves));
    const moveIdsInList = store.dispatch(
      actions.actInsertMoves(newMoveIds, data.moveList1.id, "")
    );

    t.deepEqual(
      moveIdsInList.sort(),
      [...data.moveList1.moves, ...newMoveIds].sort()
    );
  }
  t.end();
});

test("test actSetSelectedMoveListUrl", function(t) {
  const { store } = _setUp();

  store.dispatch(actions.actSetSelectedMoveListUrl("mnieber", "moves"));
  const moveList = fromStore.getSelectedMoveList(store.getState());
  t.equal(!!moveList && moveList.id, data.moveList1.id);

  t.end();
});
