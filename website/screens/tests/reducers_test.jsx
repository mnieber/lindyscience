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
    type: "INSERT_MOVE_IDS_INTO_LIST",
    moveIds,
    moveListId,
    undefined,
  });
  t.deepEqual(sMoveList[moveListId].moves, ["123", ...data.moveList1.moves]);

  t.end();
});
