// @flow

import * as React from 'react';

import type { TipT } from 'src/tips/types';
import type { UUID } from 'src/kernel/types';
import { createUUID } from 'src/utils/utils';

// Behaviours

type InsertTipBvrT = {
  preview: Array<TipT>,
  prepare: Function,
  finalize: Function,
};

export function useInsertTip(tips: Array<TipT>): InsertTipBvrT {
  const [sourceTip, setSourceTip] = React.useState(null);

  function prepare(tip: TipT) {
    setSourceTip(tip);
  }

  function finalize(isCancel: boolean) {
    setSourceTip(null);
  }

  const preview = !sourceTip ? tips : [...tips, sourceTip];

  return { preview, prepare, finalize };
}

type NewTipBvrT = {
  newTip: ?TipT,
  add: Function,
  finalize: Function,
};

export function useNewTip(
  userId: number,
  insertTipBvr: InsertTipBvrT,
  moveId: UUID
) {
  const [newTip, setNewTip] = React.useState(null);

  function _createNewTip(): TipT {
    return {
      id: createUUID(),
      ownerId: userId,
      moveId: moveId,
      text: '',
      voteCount: 0,
      initialVoteCount: 0,
    };
  }

  // Store a new move in the function's state
  function add() {
    const newTip = _createNewTip();
    setNewTip(newTip);
    insertTipBvr.prepare(newTip);
  }

  // Remove new move from the function's state
  function finalize(isCancel: boolean) {
    insertTipBvr.finalize(isCancel);
    setNewTip(null);
  }

  return { newTip, add, finalize };
}

type IncompleteValuesT = {
  text: string,
};

type SaveTipBvr = {
  save: Function,
  discardChanges: Function,
};

export function useSaveTip(
  newTipBvr: NewTipBvrT,
  moveId: UUID,
  tips: Array<TipT>,
  saveTip: (TipT) => void
) {
  function save(id: UUID, incompleteValues: IncompleteValuesT) {
    // $FlowFixMe
    const tip: TipT = {
      ...tips.find((x) => x.id == id),
      ...incompleteValues,
    };

    saveTip(tip);
    newTipBvr.finalize(false);
  }

  function discardChanges() {
    newTipBvr.finalize(true);
  }

  return { save, discardChanges };
}
