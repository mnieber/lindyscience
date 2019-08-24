// @flow

import { test } from "tape";
import * as data from "screens/tests/data";

import * as reducers from "screens/reducers";
import * as tagsReducers from "tags/reducers";
import * as movesReducers from "moves/reducers";
import * as actions from "screens/actions";
import * as movesActions from "moves/actions";
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
  let sMoveList = reducers.moveListsReducer(undefined, {});
  t.deepEqual(sMoveList, {});

  let sMoves = movesReducers.movesReducer(undefined, {});
  t.deepEqual(sMoves, {});

  const a = actions.actAddMoveLists({ [data.moveList1.id]: data.moveList1 });
  const a2 = movesActions.actAddMoves(getObjectValues(data.moves));

  sMoveList = reducers.moveListsReducer(sMoveList, a);
  t.deepEqual(sMoveList, { [data.moveList1.id]: data.moveList1 });

  sMoves = movesReducers.movesReducer(sMoves, a2);
  t.deepEqual(sMoves, data.moves);

  let sTags = tagsReducers.tagsReducer(undefined, {});
  t.deepEqual(sTags.moveListTags, {});

  sTags = tagsReducers.tagsReducer(sTags, a);
  sTags = tagsReducers.tagsReducer(sTags, a2);
  t.deepEqual(sTags.moveListTags, { one: true, two: true, three: true });
  t.deepEqual(sTags.moveTags, {
    "swing out": true,
    "basket whip": true,
    fun: true,
  });

  t.end();
});

test("insert moves into list", function(t) {
  let sMoveList = reducers.moveListsReducer(
    undefined,
    actions.actAddMoveLists({ [data.moveList1.id]: data.moveList1 })
  );
  let sMoves = movesReducers.movesReducer(
    undefined,
    movesActions.actAddMoves(getObjectValues(data.moves))
  );

  const moveIds = ["123"];
  const moveListId = data.moveList1.id;

  sMoveList = reducers.moveListsReducer(sMoveList, {
    type: "INSERT_MOVES_INTO_LIST",
    moveIds,
    moveListId,
    undefined,
  });
  t.deepEqual(sMoveList[moveListId].moves, ["123", ...data.moveList1.moves]);

  t.end();
});
