import * as React from 'react';

import { TipT } from 'src/tips/types';
import { UUID } from 'src/kernel/types';
import { createUUID } from 'src/utils/utils';

// Behaviours

type InsertTipBvrT = {
  preview: Array<TipT>;
  prepare: Function;
  finalize: Function;
};

export function useInsertTip(tips: Array<TipT>): InsertTipBvrT {
  const [sourceTip, setSourceTip] = React.useState<TipT>();

  function prepare(tip: TipT) {
    setSourceTip(tip);
  }

  function finalize(isCancel: boolean) {
    setSourceTip(undefined);
  }

  const preview = !sourceTip ? tips : [...tips, sourceTip];

  return { preview, prepare, finalize };
}

type NewTipBvrT = {
  newTip?: TipT;
  add: Function;
  finalize: Function;
};

export function useNewTip(
  userId: number,
  insertTipBvr: InsertTipBvrT,
  moveId: UUID
) {
  const [newTip, setNewTip] = React.useState<TipT>();

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
    setNewTip(undefined);
  }

  return { newTip, add, finalize };
}

type IncompleteValuesT = {
  text: string;
};

export function useSaveTip(
  newTipBvr: NewTipBvrT,
  moveId: UUID,
  tips: Array<TipT>,
  saveTip: (tip: TipT) => void
) {
  function save(id: UUID, incompleteValues: IncompleteValuesT) {
    const tip: TipT = {
      ...tips.find((x) => x.id == id),
      ...incompleteValues,
    } as TipT;

    saveTip(tip);
    newTipBvr.finalize(false);
  }

  function discardChanges() {
    newTipBvr.finalize(true);
  }

  return { save, discardChanges };
}
