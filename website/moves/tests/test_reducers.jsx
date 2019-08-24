// @flow

import { test } from "tape";
import * as data from "screens/tests/data"; // TODO
import * as actions from "moves/actions";
import * as reducers from "moves/reducers";

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
