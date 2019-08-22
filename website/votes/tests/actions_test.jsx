// @flow

import * as actions from "app/actions";
import * as data from "app/tests/data";
import * as fromStore from "app/reducers";
import { test } from "tape";
import { Thunk } from "redux-testkit";

test("test actCastVote", function(t) {
  const id = "759b488d-ffa4-467c-8157-6ca27114bda9";

  const dispatches = Thunk(actions.actCastVote)
    .withState(data.state)
    .execute(id, 1);
  t.deepEqual(dispatches[0].getAction(), {
    type: "CAST_VOTE",
    id: id,
    vote: 1,
    prevVote: -1,
  });

  t.end();
});
