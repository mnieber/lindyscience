// @flow

import { test } from "tape";
import * as data from "screens/tests/data";

import * as reducers from "screens/reducers";
import * as movesReducers from "moves/reducers";
import * as moveListsReducers from "move_lists/reducers";
import * as actions from "screens/actions";
import * as movesActions from "moves/actions";
import * as moveListsActions from "move_lists/actions";
import { getObjectValues } from "utils/utils";

test("select highlighted move", function(t) {
  let s = reducers.selectionReducer(undefined, {});
  t.equal(s.highlightedMoveSlugid, "");

  s = reducers.selectionReducer(s, {
    type: "SET_HIGHLIGHTED_MOVE_SLUGID",
    moveSlugid: "abc/efg",
  });
  t.equal(s.highlightedMoveSlugid, "abc/efg");

  t.end();
});

test("add move lists", function(t) {
  let sMoveList = moveListsReducers.moveListsReducer(undefined, {});
  t.deepEqual(sMoveList, {});

  let sMoves = movesReducers.movesReducer(undefined, {});
  t.deepEqual(sMoves, {});

  const a = moveListsActions.actAddMoveLists({
    [data.moveList1.id]: data.moveList1,
  });
  const a2 = movesActions.actAddMoves(getObjectValues(data.moves));

  sMoveList = moveListsReducers.moveListsReducer(sMoveList, a);
  t.deepEqual(sMoveList, { [data.moveList1.id]: data.moveList1 });

  sMoves = movesReducers.movesReducer(sMoves, a2);
  t.deepEqual(sMoves, data.moves);

  let sMoveListsTags = moveListsReducers.tagsReducer(undefined, {});
  t.deepEqual(sMoveListsTags, {});

  sMoveListsTags = moveListsReducers.tagsReducer(sMoveListsTags, a);
  t.deepEqual(sMoveListsTags.moveListTags, {
    one: true,
    two: true,
    three: true,
  });

  let sMovesTags = movesReducers.tagsReducer(undefined, {});
  t.deepEqual(sMovesTags, {});

  sMovesTags = movesReducers.tagsReducer(sMovesTags, a2);
  t.deepEqual(sMovesTags.moveTags, {
    "swing out": true,
    "basket whip": true,
    fun: true,
  });

  t.end();
});

test("insert moves into list", function(t) {
  let sMoveList = moveListsReducers.moveListsReducer(
    undefined,
    moveListsActions.actAddMoveLists({ [data.moveList1.id]: data.moveList1 })
  );
  let sMoves = movesReducers.movesReducer(
    undefined,
    movesActions.actAddMoves(getObjectValues(data.moves))
  );

  const moveIds = ["123"];
  const moveListId = data.moveList1.id;

  sMoveList = moveListsReducers.moveListsReducer(sMoveList, {
    type: "INSERT_MOVES_INTO_LIST",
    moveIds,
    moveListId,
    undefined,
  });
  t.deepEqual(sMoveList[moveListId].moves, ["123", ...data.moveList1.moves]);

  t.end();
});
