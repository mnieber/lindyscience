import { test } from "tape";
import * as data from "tips/tests/data";
import * as reducers from "tips/reducers";
import * as actions from "tips/actions";

test("add tips", function(t) {
  let sTips = reducers.tipsReducer(undefined, {});
  t.deepEqual(sTips, {});

  sTips = reducers.tipsReducer(sTips, actions.actAddTips(data.tips));
  t.deepEqual(sTips, data.tips);

  t.end();
});
