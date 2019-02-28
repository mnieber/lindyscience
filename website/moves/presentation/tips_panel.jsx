// @flow

import * as actions from 'moves/actions'
import * as api from 'moves/api'
import * as appApi from 'app/api'
import * as fromStore from 'moves/reducers'
import * as fromAppStore from 'app/reducers'
import * as React from 'react'
import type { UUID, VoteT, VoteByIdT, UserProfileT } from 'app/types';
import type { MoveT, TipT } from 'moves/types'
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
  userId: number,
  insertTipBvr: InsertTipBvrT,
  moveId: UUID,
) {
  const [newTip, setNewTip] = React.useState(null);

  function _createNewTip(): TipT {
    return {
      id: uuidv4(),
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

type TipsPanelPropsT = {
  moveId: UUID,
  userProfile: UserProfileT,
  tips: Array<TipT>,
  voteByObjectId: VoteByIdT,
  actAddTips: Function,
  actCastVote: Function,
};

export function TipsPanel(props: TipsPanelPropsT) {
  const insertTipBvr = useInsertTip(props.tips);
  const newTipBvr = useNewTip(props.userProfile.userId, insertTipBvr, props.moveId);
  const saveTipBvr = useSaveTip(
    newTipBvr,
    props.moveId,
    insertTipBvr.preview,
    props.actAddTips,
    createErrorHandler
  );

  const voteTip = (id: UUID, vote: VoteT) => {
    props.actCastVote(id, vote);
    appApi.voteTip(id, vote)
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
        voteByObjectId={props.voteByObjectId}
      />
    </div>
  );
};
