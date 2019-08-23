import { test } from "tape";
import * as data from "screens/tests/data"; // TODO

test("add tips", function(t) {
  let sTips = reducers.tipsReducer(undefined, {});
  t.deepEqual(sTips, {});

  sTips = reducers.tipsReducer(sTips, actions.actAddTips(data.tips));
  t.deepEqual(sTips, data.tips);

  t.end();
});
