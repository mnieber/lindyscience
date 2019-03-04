// @flow

import * as React from 'react'
import * as data from 'moves/tests/data'
import sinon from 'sinon'
// $FlowFixMe
import TestRenderer from "react-test-renderer";
import redtape from 'redtape'
import { useInsertMove, useNewMove, useSaveMove } from 'moves/containers/move_crud_behaviours'
import { getObjectValues } from 'utils/utils'
import { _createNewMove } from 'moves/containers/move_crud_behaviours'
// $FlowFixMe
import { __RewireAPI__ as MoveCrudBehavioursRewireAPI } from 'moves/containers/move_crud_behaviours'

const sandbox = {};

const test = redtape({
  beforeEach: function (cb) {
    cb();
  },
  afterEach: function (cb) {
    sinon.restore();
    cb();
  },
  // add the `like` function to the `t` test object
  asserts: {
    calledOnceWith: function(stubFn, args, msg) {
      this.assert(
        stubFn.calledOnce,
        `${msg} (times called: ${stubFn.callCount})`
      );
      if (stubFn.firstCall) {
        this.deepEqual(
          stubFn.firstCall.args, args,
          `${msg} (arguments match)`
        );
      }
      else {
        this.deepEqual(
          stubFn.args, args,
          `${msg} (arguments match)`
        );
      }
    }
  }
});


function TestComponent({
  moves,
  actInsertMoves,
  setHighlightedMoveId,
  setIsEditing,
  highlightedMoveId,
  actUpdateMoves,
}) {
  const createErrorHandler = () => (() => {});

  sandbox.insertMoveBvr = useInsertMove(
    moves,
    actInsertMoves,
    data.moveList1.id,
    createErrorHandler
  )
  sandbox.insertMoveBvr.prepare = sinon.spy(sandbox.insertMoveBvr.prepare);

  sandbox.newMoveBvr = useNewMove(
    data.profile1.userId,
    highlightedMoveId,
    setHighlightedMoveId,
    sandbox.insertMoveBvr,
    setIsEditing,
  );

  sandbox.saveMoveBvr = useSaveMove(
    sandbox.insertMoveBvr.preview,
    sandbox.newMoveBvr,
    setIsEditing,
    actUpdateMoves,
    createErrorHandler,
  )

  return [];
}


test('test useInsertMove', function (t) {
  const moves = getObjectValues(data.moves);
  const newMove = _createNewMove(data.profile1.userId);
  const expectedNewMoves = [moves[0], moves[1], newMove, moves[2]];

  var actInsertMoves = sinon.fake.returns(["new", "move", "ids"]);
  var saveMoveListOrdering = sinon.fake.resolves(true);

  MoveCrudBehavioursRewireAPI.__Rewire__('api', {
    saveMoveListOrdering
  });

  const testComponent = TestRenderer.create(<TestComponent
    moves={moves}
    actInsertMoves={actInsertMoves}
    setHighlightedMoveId={()=>{}}
    setIsEditing={()=>{}}
    highlightedMoveId={""}
    actUpdateMoves={()=>{}}
  />);
  t.deepEqual(
    sandbox.insertMoveBvr.preview, moves,
    "Initially, the preview is just the list of moves"
  );

  sandbox.insertMoveBvr.prepare(moves[1].id, newMove);
  t.deepEqual(
    sandbox.insertMoveBvr.preview, expectedNewMoves,
    "After prepare, the preview should contain the new move"
  );

  sandbox.insertMoveBvr.finalize(/* cancel */ true);
  t.deepEqual(
    sandbox.insertMoveBvr.preview, moves,
    "After finalize with cancel, the preview shouldn't contain the new move"
  );
  t.assert(!actInsertMoves.called);
  t.assert(!saveMoveListOrdering.called);

  sandbox.insertMoveBvr.prepare(moves[1].id, newMove);
  sandbox.insertMoveBvr.finalize(/* cancel */ false);

  t.calledOnceWith(
    actInsertMoves,
    [[newMove.id], data.moveList1.id, moves[1].id],
    "After finalize, actInsertMoves should have been called"
  );
  t.calledOnceWith(
    saveMoveListOrdering,
    [data.moveList1.id, ["new", "move", "ids"]],
    "After finalize, saveMoveListOrdering should have been called"
  );

  t.end();
});


test('test useNewMove', function (t) {
  const moves = getObjectValues(data.moves);
  const highlightedMove = moves[1];

  sandbox.highlightedMoveId = highlightedMove.id;
  const setHighlightedMoveIdStub = moveId => sandbox.highlightedMoveId = moveId;
  const setHighlightedMoveId = sinon.stub().callsFake(
    setHighlightedMoveIdStub
  );

  const setIsEditing = sinon.fake();

  var actInsertMoves = sinon.fake.returns(["new", "move", "ids"]);
  var saveMoveListOrdering = sinon.fake.resolves(true);

  MoveCrudBehavioursRewireAPI.__Rewire__('api', {
    saveMoveListOrdering
  });

  const testComponent = TestRenderer.create(<TestComponent
    moves={moves}
    actInsertMoves={actInsertMoves}
    setHighlightedMoveId={setHighlightedMoveId}
    setIsEditing={setIsEditing}
    highlightedMoveId={sandbox.highlightedMoveId}
    actUpdateMoves={()=>{}}
  />);

  t.equal(
    sandbox.newMoveBvr.newMove, null,
    "Initially, there is no newMove"
  );

  const prepare = sandbox.insertMoveBvr.prepare;
  sandbox.newMoveBvr.addNewMove();
  t.notEqual(
    sandbox.newMoveBvr.newMove, null,
    "After addNewMove(), there is a newMove"
  );

  t.calledOnceWith(
    prepare,
    [highlightedMove.id, sandbox.newMoveBvr.newMove],
    "After addNewMove(), the preview contains the newMove"
  );

  t.assertOnceWith(
    setIsEditing,
    [true],
    "After addNewMove(), editing should have been enabled"
  );

  t.calledOnceWith(
    setHighlightedMoveId,
    [!!sandbox.newMoveBvr.newMove && sandbox.newMoveBvr.newMove.id],
    "After addNewMove(), the new move should have the highlight"
  );

  sinon.reset();
  sandbox.newMoveBvr.finalize(/* cancel */ true);

  t.assertOnceWith(
    setIsEditing,
    [false],
    "After finalize with cancel, editing should have been disabled"
  );
  t.calledOnceWith(
    setHighlightedMoveId,
    [highlightedMove.id],
    "After finalize with cancel, the previous highlight should be restored"
  );

  sandbox.newMoveBvr.addNewMove();
  sandbox.newMoveBvr.setHighlightedMoveId(
    "18561d09-0727-441d-bdd9-d3d8c33ebde3"
  );
  t.assert(
    !sandbox.newMoveBvr.newMove,
    "Changing the highlight should cancel the new move"
  );

  sandbox.newMoveBvr.addNewMove();
  sandbox.newMoveBvr.setHighlightedMoveId(
    !!sandbox.newMoveBvr.newMove && sandbox.newMoveBvr.newMove.id
  );
  t.assert(
    !!sandbox.newMoveBvr.newMove,
    "Changing the highlight to the new move shouldn't cancel the new move"
  );

  t.end();
});


test('test useSaveMove', function (t) {
  const moves = getObjectValues(data.moves);

  const setIsEditing = sinon.fake();

  var actInsertMoves = sinon.fake.returns(["new", "move", "ids"]);
  var actUpdateMoves = sinon.fake();
  var saveMoveListOrdering = sinon.fake.resolves(true);
  var saveMove = sinon.fake.resolves(true);

  MoveCrudBehavioursRewireAPI.__Rewire__('api', {
    saveMoveListOrdering,
    saveMove
  });

  const testComponent = TestRenderer.create(<TestComponent
    moves={moves}
    actInsertMoves={actInsertMoves}
    setHighlightedMoveId={() => {}}
    setIsEditing={setIsEditing}
    highlightedMoveId={moves[1].id}
    actUpdateMoves={actUpdateMoves}
  />);

  sandbox.newMoveBvr.finalize = sinon.fake();
  sandbox.saveMoveBvr.discardChanges();
  t.calledOnceWith(
    sandbox.newMoveBvr.finalize, [true],
    "Discarding the move should cancel the new move"
  );
  t.calledOnceWith(
    setIsEditing, [false],
    "Discarding the move should disable editing"
  );

  sinon.reset();

  sandbox.newMoveBvr.finalize = sinon.fake();
  sandbox.saveMoveBvr.saveMove(moves[1].id, {});
  t.calledOnceWith(
    actUpdateMoves, [[moves[1]]],
    "Saving a move should call actUpdateMoves"
  );
  t.calledOnceWith(
    sandbox.newMoveBvr.finalize, [false],
    "Saving a move should call newMoveBvr.finalize"
  );
  t.calledOnceWith(
    setIsEditing, [false],
    "Saving a move should call setIsEditing(false)"
  );
  t.calledOnceWith(
    saveMove, [false, moves[1]],
    "Saving a move should call saveMove"
  );

  sinon.reset();

  sandbox.newMoveBvr.addNewMove();
  sandbox.newMoveBvr.finalize = sinon.fake();
  sandbox.saveMoveBvr.saveMove(
    !!sandbox.newMoveBvr.newMove && sandbox.newMoveBvr.newMove.id, {}
  );

  t.calledOnceWith(
    saveMove, [true, sandbox.newMoveBvr.newMove],
    "Saving a new move should use isNewMove=true"
  );

  t.end();
});
