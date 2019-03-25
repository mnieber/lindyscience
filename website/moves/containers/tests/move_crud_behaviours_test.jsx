// @flow

import * as React from "react";
import * as data from "moves/tests/data";
import sinon from "sinon";
// $FlowFixMe
import TestRenderer from "react-test-renderer";
import {
  useNewMove,
  useSaveMove,
  createNewMove,
} from "moves/containers/move_crud_behaviours";
import { useInsertItems } from "moves/containers/crud_behaviours";
import { createDataContainerWithLocalState } from "moves/containers/data_container";
import { getObjectValues } from "utils/utils";
// $FlowFixMe
import { __RewireAPI__ as MoveCrudBehavioursRewireAPI } from "moves/containers/move_crud_behaviours";
import { test } from "utils/test_utils";

const sandbox = {};

function TestComponent({
  moves,
  insertMoves,
  setHighlightedMoveId,
  setIsEditing,
  highlightedMoveId,
  updateMove,
}) {
  sandbox.movesContainer = createDataContainerWithLocalState(moves);

  if (insertMoves != undefined) {
    sandbox.movesContainer.insert = insertMoves;
  }

  sandbox.insertMovesBvr = useInsertItems(sandbox.movesContainer);
  sandbox.insertMovesBvr.prepare = sinon.spy(sandbox.insertMovesBvr.prepare);

  sandbox.newMoveBvr = useNewMove(
    data.profile1,
    setHighlightedMoveId,
    highlightedMoveId,
    sandbox.insertMovesBvr,
    setIsEditing
  );

  sandbox.saveMoveBvr = useSaveMove(
    sandbox.movesContainer.preview,
    sandbox.newMoveBvr,
    setIsEditing,
    updateMove
  );

  return [];
}

test("test useInsertMoves", function(t) {
  const moves = getObjectValues(data.moves);
  const newMove = createNewMove(data.profile1);

  if (newMove) {
    const expectedNewMoves = [moves[0], moves[1], newMove, moves[2], moves[3]];

    var saveMoveOrdering = sinon.fake.resolves(true);
    MoveCrudBehavioursRewireAPI.__Rewire__("api", {
      saveMoveOrdering,
    });

    const insertMoves = sinon.fake.returns(["new", "move", "ids"]);
    const testComponent = TestRenderer.create(
      <TestComponent
        moves={moves}
        insertMoves={insertMoves}
        setHighlightedMoveId={() => {}}
        setIsEditing={() => {}}
        highlightedMoveId={""}
        updateMove={() => {}}
      />
    );

    t.deepEqual(
      sandbox.movesContainer.preview,
      moves,
      "Initially, the preview is just the list of moves"
    );

    sandbox.insertMovesBvr.prepare([newMove], moves[1].id);
    t.deepEqual(
      sandbox.movesContainer.preview,
      expectedNewMoves,
      "After prepare, the preview should contain the new move"
    );

    sandbox.insertMovesBvr.finalize(/* cancel */ true);
    t.deepEqual(
      sandbox.movesContainer.preview,
      moves,
      "After finalize with cancel, the preview shouldn't contain the new move"
    );
    t.assert(!sandbox.movesContainer.insert.called);
    t.assert(!saveMoveOrdering.called);

    sandbox.insertMovesBvr.prepare([newMove], moves[1].id);
    sandbox.insertMovesBvr.finalize(/* cancel */ false);

    t.calledOnceWith(
      insertMoves,
      [[newMove.id], moves[1].id, false],
      "After finalize, insertMoves should have been called"
    );
  }

  t.end();
});

test("test useNewMove", function(t) {
  const moves = getObjectValues(data.moves);
  const highlightedMove = moves[1];

  const setHighlightedMoveId = sinon.fake();
  const setIsEditing = sinon.fake();

  var saveMoveOrdering = sinon.fake.resolves(true);
  var saveMove = sinon.fake.resolves(true);
  var saveMovePrivateData = sinon.fake.resolves(true);

  MoveCrudBehavioursRewireAPI.__Rewire__("api", {
    saveMoveOrdering,
    saveMove,
    saveMovePrivateData,
  });

  const testComponent = TestRenderer.create(
    <TestComponent
      moves={moves}
      insertMoves={undefined}
      setHighlightedMoveId={setHighlightedMoveId}
      setIsEditing={setIsEditing}
      highlightedMoveId={highlightedMove.id}
      updateMove={() => {}}
    />
  );

  t.equal(sandbox.newMoveBvr.newItem, null, "Initially, there is no newMove");

  const prepare = sandbox.insertMovesBvr.prepare;
  sandbox.newMoveBvr.addNewItem();
  t.notEqual(
    sandbox.newMoveBvr.newItem,
    null,
    "After addNewItem(), there is a newMove"
  );

  t.calledOnceWith(
    prepare,
    [[sandbox.newMoveBvr.newItem], highlightedMove.id],
    "After addNewItem(), the preview contains the newMove"
  );

  t.calledOnceWith(
    setIsEditing,
    [true],
    "After addNewItem(), editing should have been enabled"
  );

  t.calledOnceWith(
    setHighlightedMoveId,
    [!!sandbox.newMoveBvr.newItem && sandbox.newMoveBvr.newItem.id],
    "After addNewItem(), the new move should have the highlight"
  );

  sinon.reset();
  sandbox.newMoveBvr.finalize(/* cancel */ true);

  t.calledOnceWith(
    setIsEditing,
    [false],
    "After finalize with cancel, editing should have been disabled"
  );
  t.calledOnceWith(
    setHighlightedMoveId,
    [highlightedMove.id],
    "After finalize with cancel, the previous highlight should be restored"
  );

  sandbox.newMoveBvr.addNewItem();
  sandbox.newMoveBvr.setHighlightedItemId(
    "18561d09-0727-441d-bdd9-d3d8c33ebde3"
  );
  t.assert(
    !sandbox.newMoveBvr.newItem,
    "Changing the highlight should cancel the new move"
  );

  sandbox.newMoveBvr.addNewItem();
  sandbox.newMoveBvr.setHighlightedItemId(
    sandbox.newMoveBvr.newItem ? sandbox.newMoveBvr.newItem.id : ""
  );
  t.assert(
    !!sandbox.newMoveBvr.newItem,
    "Changing the highlight to the new move shouldn't cancel the new move"
  );

  t.end();
});

test("test useSaveMove", function(t) {
  const moves = getObjectValues(data.moves);

  const setIsEditing = sinon.fake();

  var updateMove = sinon.fake();
  var saveMoveOrdering = sinon.fake.resolves(true);
  var saveMove = sinon.fake.resolves(true);

  MoveCrudBehavioursRewireAPI.__Rewire__("api", {
    saveMoveOrdering,
    saveMove,
  });

  const testComponent = TestRenderer.create(
    <TestComponent
      moves={moves}
      insertMoves={undefined}
      setHighlightedMoveId={() => {}}
      setIsEditing={setIsEditing}
      highlightedMoveId={moves[1].id}
      updateMove={updateMove}
    />
  );

  sandbox.newMoveBvr.finalize = sinon.fake();
  sandbox.saveMoveBvr.discardChanges();
  t.calledOnceWith(
    sandbox.newMoveBvr.finalize,
    [true],
    "Discarding the move should cancel the new move"
  );
  t.calledOnceWith(
    setIsEditing,
    [false],
    "Discarding the move should disable editing"
  );

  sinon.reset();

  sandbox.newMoveBvr.finalize = sinon.fake();
  sandbox.saveMoveBvr.saveItem(moves[1].id, {});
  t.calledOnceWith(
    updateMove,
    [moves[1], moves[1]],
    "Saving a move should call updateMove"
  );
  t.calledOnceWith(
    sandbox.newMoveBvr.finalize,
    [false],
    "Saving a move should call newMoveBvr.finalize"
  );

  sinon.reset();

  t.end();
});
