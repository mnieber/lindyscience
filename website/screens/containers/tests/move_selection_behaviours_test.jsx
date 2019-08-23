// @flow

import * as React from "react";
import * as data from "screens/tests/data";
// $FlowFixMe
import TestRenderer from "react-test-renderer";
import { useSelectItems } from "screens/containers/move_selection_behaviours";
import { getObjectValues } from "utils/utils";
import { test } from "utils/test_utils";

import type { MoveT } from "moves/types";

const sandbox = {};

function TestComponent({ moves, highlightedMoveId, setHighlightedMoveId }) {
  sandbox.selectMovesBvr = useSelectItems<MoveT>(
    moves,
    highlightedMoveId,
    setHighlightedMoveId
  );

  return [];
}

test("test selectInsertMoves", function(t) {
  const moves = getObjectValues(data.moves);

  const testComponent = TestRenderer.create(
    <TestComponent
      moves={moves}
      setHighlightedMoveId={() => {}}
      highlightedMoveId={moves[1].id}
    />
  );

  t.deepEqual(
    sandbox.selectMovesBvr.selectedItems,
    [],
    "Initially, nothing is selected"
  );

  sandbox.selectMovesBvr.select(moves[1].id, false, false);
  t.deepEqual(
    sandbox.selectMovesBvr.selectedItems,
    [moves[1]],
    "Select one item, which is the anchor"
  );

  sandbox.selectMovesBvr.select(moves[2].id, false, false);
  t.deepEqual(
    sandbox.selectMovesBvr.selectedItems,
    [moves[2]],
    "Select one item, which is not the anchor"
  );

  sandbox.selectMovesBvr.select(moves[0].id, false, true);
  t.deepEqual(
    sandbox.selectMovesBvr.selectedItems,
    [moves[2], moves[0]],
    "Toggle to select an extra item"
  );

  sandbox.selectMovesBvr.select(moves[3].id, true, false);
  t.deepEqual(
    sandbox.selectMovesBvr.selectedItems,
    [moves[1], moves[2], moves[3]],
    "Select a range"
  );

  sandbox.selectMovesBvr.select(moves[2].id, false, true);
  t.deepEqual(
    sandbox.selectMovesBvr.selectedItems,
    [moves[1], moves[3]],
    "Toggle to unselect an item"
  );

  sandbox.selectMovesBvr.select(moves[1].id, true, false);
  t.deepEqual(
    sandbox.selectMovesBvr.selectedItems,
    [moves[1]],
    "Select a range of size 1"
  );

  t.end();
});
