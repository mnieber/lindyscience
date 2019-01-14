// @flow

import {test} from 'tape'
import * as data from 'moves/tests/data'

import * as reducers from 'moves/reducers'
import * as actions from 'moves/actions'

test('select move list by id', function (t) {
  let s = reducers.selectionReducer(undefined, {});
  t.equal(s.moveListId, "");

  s = reducers.selectionReducer(s, {
    type: 'SELECT_MOVE_LIST',
    moveListId: "123",
  });
  t.equal(s.moveListId, "123");

  t.end();
});

test('select highlighted move by id', function (t) {
  let s = reducers.selectionReducer(undefined, {});
  t.equal(s.highlightedMoveId, "");

  s = reducers.selectionReducer(s, actions.actSetHighlightedMoveId("123"));
  t.equal(s.highlightedMoveId, "123");

  t.end();
});

test('set move list filter', function (t) {
  let s = reducers.selectionReducer(undefined, {});
  t.deepEqual(s.moveFilterTags, []);

  s = reducers.selectionReducer(s, {
    type: 'SET_MOVE_LIST_FILTER',
    tags: ["123"],
  });
  t.deepEqual(s.moveFilterTags, ["123"]);

  t.end();
});

test('add move lists', function (t) {
  let sMoveList = reducers.moveListsReducer(undefined, {});
  t.deepEqual(sMoveList, {});

  let sMoves = reducers.movesReducer(undefined, {});
  t.deepEqual(sMoves, {});

  let sTags = reducers.tagsReducer(undefined, {});
  t.deepEqual(sTags.moveListTags, {});

  const a = actions.actAddMoveLists(
    {[data.moveList1.id]: data.moveList1},
    data.moves
  );

  sMoveList = reducers.moveListsReducer(sMoveList, a);
  t.deepEqual(sMoveList, {[data.moveList1.id]: data.moveList1});

  sMoves = reducers.movesReducer(sMoves, a);
  t.deepEqual(sMoves, data.moves);

  sTags = reducers.tagsReducer(sTags, a);
  t.deepEqual(sTags.moveListTags, {one: true, two:true, three:true});
  t.deepEqual(sTags.moveTags, {
    "swing out": true,
    "basket whip":true,
    fun:true
  });

  t.end();
});

test('set votes', function (t) {
  let sVotes = reducers.votesReducer(undefined, {});
  t.deepEqual(sVotes, {});

  sVotes = reducers.votesReducer(sVotes, actions.actSetVotes(data.votes));
  t.deepEqual(sVotes, data.votes);

  t.end();
});

test('cast vote', function (t) {
  const id = "759b488d-ffa4-467c-8157-6ca27114bda9";

  let sVotes = reducers.votesReducer(undefined, actions.actSetVotes(data.votes));
  t.equal(sVotes[id], -1);

  sVotes = reducers.votesReducer(sVotes, {
    type: 'CAST_VOTE',
    id: id,
    vote: 1,
    prevVote: -1,
  });
  t.equal(sVotes[id], 1);

  t.end();
});

test('add move private datas', function (t) {
  let sVotes = reducers.movePrivateDatasReducer(undefined, {});
  t.deepEqual(sVotes, {});

  sVotes = reducers.movePrivateDatasReducer(sVotes, actions.actAddMovePrivateDatas(data.movePrivateDatas));
  t.deepEqual(sVotes, data.movePrivateDatas);

  t.end();
});

test('add video links', function (t) {
  let sVideoLinks = reducers.videoLinksReducer(undefined, {});
  t.deepEqual(sVideoLinks, {});

  sVideoLinks = reducers.videoLinksReducer(sVideoLinks, actions.actAddVideoLinks(data.videoLinks));
  t.deepEqual(sVideoLinks, data.videoLinks);

  t.end();
});

test('add tips', function (t) {
  let sTips = reducers.tipsReducer(undefined, {});
  t.deepEqual(sTips, {});

  sTips = reducers.tipsReducer(sTips, actions.actAddTips(data.tips));
  t.deepEqual(sTips, data.tips);

  t.end();
});

test('insert moves into list', function (t) {
  let sMoveList = reducers.moveListsReducer(undefined, actions.actAddMoveLists(
    {[data.moveList1.id]: data.moveList1},
    data.moves
  ));

  const moveIds = ["123"];
  const moveListId = data.moveList1.id;

  sMoveList = reducers.moveListsReducer(sMoveList, {
    type: 'INSERT_MOVES_INTO_LIST',
    moveIds,
    moveListId,
    undefined,
  });
  t.deepEqual(sMoveList[moveListId].moves, ["123", ...data.moveList1.moves]);

  t.end();
});

test('update moves', function (t) {
  const move = data.moves["18561d09-0727-441d-bdd9-d3d8c33ebde3"];
  let sMoves = reducers.movesReducer(undefined, actions.actUpdateMoves(
    [move]
  ));
  t.deepEqual(sMoves, {[move.id]: move});

  t.end();
});
