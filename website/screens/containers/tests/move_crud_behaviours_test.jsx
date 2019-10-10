// @flow

import * as React from "react";
import * as data from "screens/tests/data";
import sinon from "sinon";
// $FlowFixMe
import TestRenderer from "react-test-renderer";
import { createMoveCrudBvrs } from "screens/bvrs/move_crud_behaviours";
import { createNewMove } from "screens/bvrs/move_crud_behaviours";
import { createDataContainerWithLocalState } from "screens/containers/data_container";
import { getObjectValues } from "utils/utils";
// $FlowFixMe
import { __RewireAPI__ as MoveCrudBehavioursRewireAPI } from "screens/bvrs/move_crud_behaviours";
import { test } from "utils/test_utils";

const sandbox = {};

function TestComponent({
  moves,
  setHighlightedMoveId,
  setIsEditing,
  highlightedMoveId,
  updateMove,
}) {
  sandbox.moveContainer = createDataContainerWithLocalState(moves);

  const browseToMove = sinon.fake();
  const actAddMoves = sinon.fake();
  const isEditing = false;

  const moveCrudBvrs = createMoveCrudBvrs(
    data.moveList1,
    data.profile1,
    highlightedMoveId,
    setHighlightedMoveId,
    sandbox.moveContainer,
    browseToMove,
    actAddMoves,
    isEditing,
    setIsEditing
  );

  sandbox.editMoveBvr = moveCrudBvrs.editMoveBvr;
  return [];
}

test("test useInsertMoves", function(t) {
  const moves = getObjectValues(data.moves);
  const newMove = createNewMove(data.profile1, data.moveList1.id);

  if (newMove) {
    const expectedNewMoves = [moves[0], moves[1], newMove, moves[2], moves[3]];

    var saveMoveOrdering = sinon.fake.resolves(true);
    MoveCrudBehavioursRewireAPI.__Rewire__("api", {
      saveMoveOrdering,
    });

    const testComponent = TestRenderer.create(
      <TestComponent
        moves={moves}
        setHighlightedMoveId={() => {}}
        setIsEditing={() => {}}
        highlightedMoveId={""}
        updateMove={() => {}}
      />
    );

    t.deepEqual(
      sandbox.moveContainer.preview,
      moves,
      "Initially, the preview is just the list of moves"
    );

    sandbox.moveContainer.setPayload({
      payload: [newMove],
      targetItemId: moves[1].id,
      isBefore: false,
    });
    t.deepEqual(
      sandbox.moveContainer.preview,
      expectedNewMoves,
      "After prepare, the preview should contain the new move"
    );

    sandbox.moveContainer.insertPayload(/* cancel */ true);
    t.deepEqual(
      sandbox.moveContainer.preview,
      moves,
      "After finalize with cancel, the preview shouldn't contain the new move"
    );
    t.assert(!saveMoveOrdering.called);

    sandbox.moveContainer.setPayload({
      payload: [newMove],
      targetItemId: moves[1].id,
      isBefore: false,
    });
    sandbox.moveContainer.insertPayload(false);
  }

  t.end();
});

test.only("test useNewMove", function(t) {
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
      setHighlightedMoveId={setHighlightedMoveId}
      setIsEditing={setIsEditing}
      highlightedMoveId={highlightedMove.id}
      updateMove={() => {}}
    />
  );

  const setPayload = sinon.spy(sandbox.moveContainer, "setPayload");

  t.equal(sandbox.editMoveBvr.newItem, null, "Initially, there is no newMove");

  sandbox.editMoveBvr.addNewItem({});
  t.notEqual(
    sandbox.editMoveBvr.newItem,
    null,
    "After addNewItem(), there is a newMove"
  );

  t.calledOnceWith(
    setPayload,
    [
      {
        payload: [sandbox.editMoveBvr.newItem],
        targetItemId: highlightedMove.id,
        isBefore: false,
      },
    ],
    "After addNewItem(), the preview contains the newMove"
  );

  t.calledOnceWith(
    setIsEditing,
    [true],
    "After addNewItem(), editing should have been enabled"
  );

  t.calledOnceWith(
    setHighlightedMoveId,
    [!!sandbox.editMoveBvr.newItem && sandbox.editMoveBvr.newItem.id],
    "After addNewItem(), the new move should have the highlight"
  );

  sinon.reset();
  sandbox.editMoveBvr.finalize(/* cancel */ true, null);

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

  sandbox.editMoveBvr.addNewItem({});
  sandbox.editMoveBvr.setHighlightedItemId(
    "18561d09-0727-441d-bdd9-d3d8c33ebde3"
  );
  t.assert(
    !sandbox.editMoveBvr.newItem,
    "Changing the highlight should cancel the new move"
  );

  sandbox.editMoveBvr.addNewItem({});
  sandbox.editMoveBvr.setHighlightedItemId(
    sandbox.editMoveBvr.newItem ? sandbox.editMoveBvr.newItem.id : ""
  );
  t.assert(
    !!sandbox.editMoveBvr.newItem,
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
      setHighlightedMoveId={() => {}}
      setIsEditing={setIsEditing}
      highlightedMoveId={moves[1].id}
      updateMove={updateMove}
    />
  );

  const finalize = sinon.spy(sandbox.editMoveBvr, "finalize");

  sandbox.saveMoveBvr.discardChanges();
  t.calledOnceWith(
    finalize,
    [true],
    "Discarding the move should cancel the new move"
  );
  t.calledOnceWith(
    setIsEditing,
    [false],
    "Discarding the move should disable editing"
  );

  sinon.reset();

  finalize.resetHistory();

  sandbox.saveMoveBvr.saveItem(moves[1].id, {});
  t.calledOnceWith(
    updateMove,
    [moves[1], moves[1]],
    "Saving a move should call updateMove"
  );
  t.calledOnceWith(
    finalize,
    [false],
    "Saving a move should call editMoveBvr.finalize"
  );

  sinon.reset();

  t.end();
});
