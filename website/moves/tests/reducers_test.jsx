// @flow

import { test } from "tape";
import * as data from "moves/tests/data";

import * as reducers from "moves/reducers";
import * as actions from "moves/actions";
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

  let sMoves = reducers.movesReducer(undefined, {});
  t.deepEqual(sMoves, {});

  const a = actions.actAddMoveLists({ [data.moveList1.id]: data.moveList1 });
  const a2 = actions.actAddMoves(getObjectValues(data.moves));

  sMoveList = reducers.moveListsReducer(sMoveList, a);
  t.deepEqual(sMoveList, { [data.moveList1.id]: data.moveList1 });

  sMoves = reducers.movesReducer(sMoves, a2);
  t.deepEqual(sMoves, data.moves);

  let sTags = reducers.tagsReducer(undefined, {});
  t.deepEqual(sTags.moveListTags, {});

  sTags = reducers.tagsReducer(sTags, a);
  sTags = reducers.tagsReducer(sTags, a2);
  t.deepEqual(sTags.moveListTags, { one: true, two: true, three: true });
  t.deepEqual(sTags.moveTags, {
    "swing out": true,
    "basket whip": true,
    fun: true,
  });

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

test("add video links", function(t) {
  let sVideoLinks = reducers.videoLinksReducer(undefined, {});
  t.deepEqual(sVideoLinks, {});

  sVideoLinks = reducers.videoLinksReducer(
    sVideoLinks,
    actions.actAddVideoLinks(data.videoLinks)
  );
  t.deepEqual(sVideoLinks, data.videoLinks);

  t.end();
});

test("add tips", function(t) {
  let sTips = reducers.tipsReducer(undefined, {});
  t.deepEqual(sTips, {});

  sTips = reducers.tipsReducer(sTips, actions.actAddTips(data.tips));
  t.deepEqual(sTips, data.tips);

  t.end();
});

test("insert moves into list", function(t) {
  let sMoveList = reducers.moveListsReducer(
    undefined,
    actions.actAddMoveLists({ [data.moveList1.id]: data.moveList1 })
  );
  let sMoves = reducers.movesReducer(
    undefined,
    actions.actAddMoves(getObjectValues(data.moves))
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

test("update moves", function(t) {
  const move = data.moves["18561d09-0727-441d-bdd9-d3d8c33ebde3"];
  let sMoves = reducers.movesReducer(undefined, actions.actAddMoves([move]));
  t.deepEqual(sMoves, { [move.id]: move });

  t.end();
});
