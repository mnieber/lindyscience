// @flow

import * as React from "react";

import { TipList } from "moves/presentation/tip";

// $FlowFixMe
import uuidv4 from "uuid/v4";

import type { UUID, VoteT, VoteByIdT, UserProfileT } from "app/types";
import type { MoveT, TipT } from "moves/types";

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
      id: uuidv4(),
      ownerId: userId,
      moveId: moveId,
      text: "",
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
  saveTip: TipT => void
) {
  function save(id: UUID, incompleteValues: IncompleteValuesT) {
    const tip: TipT = {
      ...tips.find(x => x.id == id),
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

type TipsPanelPropsT = {
  move: MoveT,
  userProfile: UserProfileT,
  tips: Array<TipT>,
  voteByObjectId: VoteByIdT,
  saveTip: TipT => void,
  deleteTip: TipT => void,
  voteTip: (UUID, VoteT) => void,
};

export function TipsPanel(props: TipsPanelPropsT) {
  const insertTipBvr = useInsertTip(props.tips);
  const newTipBvr = useNewTip(
    props.userProfile.userId,
    insertTipBvr,
    props.move.id
  );
  const saveTipBvr = useSaveTip(
    newTipBvr,
    props.move.id,
    insertTipBvr.preview,
    props.saveTip
  );

  const addTipBtn = (
    <div
      className={"tipsPanel__addButton button button--wide ml-2"}
      onClick={newTipBvr.add}
    >
      Add
    </div>
  );

  return (
    <div className={"tipsPanel panel"}>
      <div className={"flex flex-wrap mb-4"}>
        <h2>Tips</h2>
        {addTipBtn}
      </div>
      <TipList
        userProfile={props.userProfile}
        move={props.move}
        items={insertTipBvr.preview}
        setVote={props.voteTip}
        saveTip={saveTipBvr.save}
        deleteTip={props.deleteTip}
        cancelEditTip={saveTipBvr.discardChanges}
        voteByObjectId={props.voteByObjectId}
      />
    </div>
  );
}
