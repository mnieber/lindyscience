// @flow

import { test } from "tape";
import { getObjectValues } from "utils/utils";
import * as data from "moves/tests/data";
import * as actions from "moves/actions";
import * as reducers from "moves/reducers";

test("add moves", function(t) {
  let sMoves = reducers.movesReducer(undefined, {});
  t.deepEqual(sMoves, {});

  const a = actions.actAddMoves(getObjectValues(data.moves));

  sMoves = reducers.movesReducer(sMoves, a);
  t.deepEqual(sMoves, data.moves);

  let sTags = reducers.tagsReducer(undefined, {});
  t.deepEqual(sTags, {});

  sTags = reducers.tagsReducer(sTags, a);
  t.deepEqual(sTags, {
    "swing out": true,
    "basket whip": true,
    fun: true,
  });

  t.end();
});

test("update moves", function(t) {
  const move = data.moves["18561d09-0727-441d-bdd9-d3d8c33ebde3"];
  let sMoves = reducers.movesReducer(undefined, actions.actAddMoves([move]));
  t.deepEqual(sMoves, { [move.id]: move });

  t.end();
});

test("add move private datas", function(t) {
  let sMovePrivateDatas = reducers.movePrivateDatasReducer(undefined, {});
  t.deepEqual(sMovePrivateDatas, {});

  sMovePrivateDatas = reducers.movePrivateDatasReducer(
    sMovePrivateDatas,
    actions.actAddMovePrivateDatas(data.movePrivateDatas)
  );
  t.deepEqual(sMovePrivateDatas, data.movePrivateDatas);

  t.end();
});
