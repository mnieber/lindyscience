// @flow

import * as React from 'react'
import * as data from 'moves/tests/data'
import sinon from 'sinon'
// $FlowFixMe
import TestRenderer from "react-test-renderer";
import redtape from 'redtape'
import { useInsertMove, useNewMove, useSaveMove } from 'moves/containers/movespage'
import { getObjectValues } from 'utils/utils'
import { _createNewMove } from 'moves/containers/movespage'
import MovesPage from 'moves/containers/movespage'

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
  setEditingEnabled,
  setEditingDisabled,
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
    data.profile.userId,
    highlightedMoveId,
    setHighlightedMoveId,
    sandbox.insertMoveBvr,
    setEditingEnabled,
    setEditingDisabled,
  );

  sandbox.saveMoveBvr = useSaveMove(
    sandbox.insertMoveBvr.preview,
    sandbox.newMoveBvr,
    setEditingDisabled,
    actUpdateMoves,
    createErrorHandler,
  )

  return [];
}


test('test useInsertMove', function (t) {
  const moves = getObjectValues(data.moves);
  const newMove = _createNewMove(data.profile.userId);
  const expectedNewMoves = [moves[0], moves[1], newMove, moves[2]];

  var actInsertMoves = sinon.fake.returns(["new", "move", "ids"]);
  var saveMoveListOrdering = sinon.fake.resolves(true);

  MovesPage.__Rewire__('api', {
    saveMoveListOrdering
  });
  MovesPage.__Rewire__('actions', {
    actInsertMoves
  });

  const testComponent = TestRenderer.create(<TestComponent
    moves={moves}
    actInsertMoves={actInsertMoves}
    setHighlightedMoveId={()=>{}}
    setEditingEnabled={()=>{}}
    setEditingDisabled={()=>{}}
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
  const highlightedMoveId = moves[1].id;

  sandbox.highlightedMoveId = highlightedMoveId;
  const setHighlightedMoveIdStub = id => sandbox.highlightedMoveId = id;
  const setHighlightedMoveId = sinon.stub().callsFake(
    setHighlightedMoveIdStub
  );

  const setEditingEnabled = sinon.fake();
  const setEditingDisabled = sinon.fake();

  var actInsertMoves = sinon.fake.returns(["new", "move", "ids"]);
  var saveMoveListOrdering = sinon.fake.resolves(true);

  MovesPage.__Rewire__('api', {
    saveMoveListOrdering
  });
  MovesPage.__Rewire__('actions', {
    actInsertMoves
  });

  const testComponent = TestRenderer.create(<TestComponent
    moves={moves}
    actInsertMoves={actInsertMoves}
    setHighlightedMoveId={setHighlightedMoveId}
    setEditingEnabled={setEditingEnabled}
    setEditingDisabled={setEditingDisabled}
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
    [highlightedMoveId, sandbox.newMoveBvr.newMove],
    "After addNewMove(), the preview contains the newMove"
  );

  t.assert(
    setEditingEnabled.calledOnce,
    "After addNewMove(), editing should have been enabled"
  );

  t.calledOnceWith(
    setHighlightedMoveId,
    [sandbox.newMoveBvr.newMove && sandbox.newMoveBvr.newMove.id],
    "After addNewMove(), the new move should have the highlight"
  );

  sinon.reset();
  sandbox.newMoveBvr.finalize(/* cancel */ true);

  t.assert(
    setEditingDisabled.calledOnce,
    "After finalize with cancel, editing should have been disabled"
  );
  t.calledOnceWith(
    setHighlightedMoveId,
    [highlightedMoveId],
    "After finalize with cancel, the previous highlight should be restored"
  );

  sandbox.newMoveBvr.addNewMove();
  sandbox.newMoveBvr.setHighlightedMoveId("123");
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


test.only('test useSaveMove', function (t) {
  const moves = getObjectValues(data.moves);

  const setEditingEnabled = sinon.fake();
  const setEditingDisabled = sinon.fake();

  var actInsertMoves = sinon.fake.returns(["new", "move", "ids"]);
  var actUpdateMoves = sinon.fake();
  var saveMoveListOrdering = sinon.fake.resolves(true);
  var saveMove = sinon.fake.resolves(true);

  MovesPage.__Rewire__('api', {
    saveMoveListOrdering,
    saveMove
  });
  MovesPage.__Rewire__('actions', {
    actInsertMoves,
    actUpdateMoves,
  });

  const testComponent = TestRenderer.create(<TestComponent
    moves={moves}
    actInsertMoves={actInsertMoves}
    setHighlightedMoveId={() => {}}
    setEditingEnabled={setEditingEnabled}
    setEditingDisabled={setEditingDisabled}
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
    setEditingDisabled, [],
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
    setEditingDisabled, [],
    "Saving a move should call setEditingDisabled"
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
