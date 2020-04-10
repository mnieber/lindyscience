// @flow

import { test } from "tape";
import * as data from "move_lists/tests/data";
import * as reducers from "move_lists/reducers";
import * as actions from "move_lists/actions";

test("add move lists", function(t) {
  let sMoveLists = reducers.moveListsReducer(undefined, {});
  t.deepEqual(sMoveLists, {});

  const a = actions.actAddMoveLists({
    [data.moveList1.id]: data.moveList1,
  });

  sMoveLists = reducers.moveListsReducer(sMoveLists, a);
  t.deepEqual(sMoveLists, { [data.moveList1.id]: data.moveList1 });

  let sTags = reducers.tagsReducer(undefined, {});
  t.deepEqual(sTags, {});

  sTags = reducers.tagsReducer(sTags, a);
  t.deepEqual(sTags, {
    one: true,
    two: true,
    three: true,
  });

  t.end();
});
