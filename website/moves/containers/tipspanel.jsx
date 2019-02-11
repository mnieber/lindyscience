// @flow

import * as actions from 'moves/actions'
import * as api from 'moves/api'
import * as fromStore from 'moves/reducers'
import * as React from 'react'
import { useState } from 'react'
import type { UUID } from 'app/types';
import type { VoteByIdT, MoveT, TipT, VoteT } from 'moves/types'
// $FlowFixMe
import uuidv4 from 'uuid/v4'
import { connect } from 'react-redux'
import { createErrorHandler, querySetListToDict, slugify, isNone } from 'utils/utils'
import { TipList } from 'moves/presentation/tip';
import { useFlag } from 'utils/hooks'

// Behaviours

type InsertTipBvrT = {
  preview: Array<TipT>,
  prepare: Function,
  finalize: Function,
};

export function useInsertTip(
  tips: Array<TipT>,
): InsertTipBvrT {
  const [sourceTip, setSourceTip] = React.useState(null);

  function prepare(tip: TipT) {
    setSourceTip(tip);
  }

  function finalize(isCancel: boolean) {
    setSourceTip(null);
  }

  const preview = !sourceTip
    ? tips
    : [...tips, sourceTip]

  return {preview, prepare, finalize};
}


type NewTipBvrT = {
  newTip: ?TipT,
  add: Function,
  finalize: Function,
};

export function useNewTip(
  insertTipBvr: InsertTipBvrT,
  moveId: UUID,
) {
  const [newTip, setNewTip] = React.useState(null);

  function _createNewTip(): TipT {
    return {
      id: uuidv4(),
      ownerId: 1,  // TODO
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

  return {newTip, add, finalize};
}


type IncompleteValuesT = {
  text: string,
};

type SaveTipBvr = {
  save: Function,
  discardChanges: Function
};

export function useSaveTip(
  newTipBvr: NewTipBvrT,
  moveId: UUID,
  tips: Array<TipT>,
  actAddTips: Function,
  createErrorHandler: Function,
) {
  function save(id: UUID, incompleteValues: IncompleteValuesT) {
    const tip: TipT = {
      ...tips.find(x => x.id == id),
      ...incompleteValues,
    };

    actAddTips(querySetListToDict([tip]));
    let response = api.saveTip(
      !!newTipBvr.newTip && newTipBvr.newTip.id == id,
      moveId,
      tip,
    );
    response.catch(createErrorHandler('We could not save the tip'));

    newTipBvr.finalize(false);
  }

  function discardChanges() {
    newTipBvr.finalize(true);
  }

  return {save, discardChanges};
}


function TipsPanel({
  moveId,
  tips,
  voteByObjectId,
  actAddTips,
  actCastVote,
}: {
  moveId: UUID,
  tips: Array<TipT>,
  voteByObjectId: VoteByIdT,
  actAddTips: Function,
  actCastVote: Function,
}) {
  const insertTipBvr = useInsertTip(tips);
  const newTipBvr = useNewTip(insertTipBvr, moveId);
  const saveTipBvr = useSaveTip(
    newTipBvr,
    moveId,
    insertTipBvr.preview,
    actAddTips,
    createErrorHandler
  );

  const voteTip = (id: UUID, vote: VoteT) => {
    actCastVote(id, vote);
    api.voteTip(id, vote)
    .catch(createErrorHandler('We could not save your vote'));
  }

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
      <div className= {"flex flex-wrap mb-4"}>
        <h2>Tips</h2>
        {addTipBtn}
      </div>
      <TipList
        items={insertTipBvr.preview}
        setVote={voteTip}
        saveTip={saveTipBvr.save}
        cancelEditTip={saveTipBvr.discardChanges}
        voteByObjectId={voteByObjectId}
      />
    </div>
  );
};


function mergeProps(state: any, actions: any,
  {
    moveId
  }: {
    moveId: UUID
  }
) {
  return {
    ...state,
    ...actions,
    moveId: moveId,
    tips: state.tipsByMoveId[moveId],
  };
}

TipsPanel = connect(
  (state) => ({
    tipsByMoveId: fromStore.getTipsByMoveId(state.moves),
    voteByObjectId: fromStore.getVoteByObjectId(state.moves),
  }),
  actions,
  mergeProps
)(TipsPanel)


export default TipsPanel;
