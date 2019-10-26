// @flow

import { Thunk, FlushThunks } from "redux-testkit";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { createNewMove } from "screens/moves_container/moves_container_props";
import { test } from "tape";
import * as actions from "screens/actions";
import * as movesActions from "moves/actions";
import * as moveListsActions from "move_lists/actions";
import * as data from "screens/tests/data";
import * as fromStore from "screens/reducers";
import { getObjectValues } from "utils/utils";
import { createTagsAndKeywordsFilter } from "screens/utils";
import { reducer } from "app/root_reducer";

function _setUp() {
  const flushThunks = FlushThunks.createMiddleware();
  const store = createStore(
    reducer,
    data.state,
    applyMiddleware(flushThunks, thunk)
  );
  return { store };
}

test("test actInsertMoveIds", function(t) {
  const { store } = _setUp();
  const move1 = createNewMove(data.profile1, data.moveList1.id);
  const move2 = createNewMove(data.profile1, data.moveList1.id);
  if (move1 && move2) {
    const newMoves = [move1, move2];
    const newMoveIds = newMoves.map(x => x.id);

    store.dispatch(movesActions.actAddMoves(newMoves));
    const moveIdsInList = store.dispatch(
      moveListsActions.actInsertMoveIds(
        newMoveIds,
        data.moveList1.id,
        "",
        false
      )
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
