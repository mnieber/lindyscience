// @flow

import { test } from "tape";
import * as data from "votes/tests/data";

import * as reducers from "votes/reducers";
import * as actions from "votes/actions";

test("cast vote", function(t) {
  const id = "759b488d-ffa4-467c-8157-6ca27114bda9";

  let sVotes = reducers.votesReducer(
    undefined,
    actions.actSetVotes(data.votes)
  );
  t.equal(sVotes[id], -1);

  sVotes = reducers.votesReducer(sVotes, {
    type: "CAST_VOTE",
    id: id,
    vote: 1,
    prevVote: -1,
  });
  t.equal(sVotes[id], 1);

  t.end();
});

test("set votes", function(t) {
  let sVotes = reducers.votesReducer(undefined, {});
  t.deepEqual(sVotes, {});

  sVotes = reducers.votesReducer(sVotes, actions.actSetVotes(data.votes));
  t.deepEqual(sVotes, data.votes);

  t.end();
});
