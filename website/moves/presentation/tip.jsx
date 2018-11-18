// @flow

import * as React from 'react'
import { VoteCount } from 'moves/presentation/vote_count'
import { TipForm } from 'moves/presentation/tip_form'
import { useFlag } from 'utils/hooks'
import type { TipT, VoteT, VoteByIdT } from 'moves/types'


// Tip

export function Tip({
  item,
  vote,
  setVote,
  saveTip,
  cancelEditTip,
}: {
  item: TipT,
  vote: VoteT,
  setVote: Function,
  saveTip: Function,
  cancelEditTip: Function,
}) {
  const {
    flag: isEditing,
    setTrue: setEditingEnabled,
    setFalse: setEditingDisabled
  } = useFlag(item.text == '');

  if (isEditing) {
    function _submitValues(values) {
      saveTip(item.id, values);
      setEditingDisabled();
    }

    function _onCancel(e) {
      e.preventDefault();
      cancelEditTip(item.id);
      setEditingDisabled();
    }

    const form =
      <TipForm
        values={{
          text: item.text,
        }}
        onSubmit={_submitValues}
        onCancel={_onCancel}
      />

    return (
      <div className='tip'>
        {form}
      </div>
    );
  }
  else {
    function _setVote(value) {
      setVote(item.id, value);
    }

    const voteCount =
      <VoteCount
        vote={vote}
        count={item.voteCount}
        setVote={_setVote}
      />

    const text =
      <div className='tip__text'>
        {item.text}
      </div>;

    const editBtn =
      <div
        className="tip__editButton ml-2"
        onClick={setEditingEnabled}
      >
      edit
      </div>

    return (
      <div className='tip'>
        {voteCount}
        {text}
        {editBtn}
      </div>
    );
  }
}

// TipList

export function TipList({
  items,
  voteByObjectId,
  setVote,
  saveTip,
  cancelEditTip
}: {
  items: Array<TipT>,
  voteByObjectId: VoteByIdT,
  setVote: Function,
  saveTip: Function,
  cancelEditTip: Function,
}) {
  const itemNodes: Array<React.Node> = items.map((item, idx) => {
    return (
      <Tip
        key={item.id}
        item={item}
        vote={voteByObjectId[item.id]}
        setVote={setVote}
        saveTip={saveTip}
        cancelEditTip={cancelEditTip}
      />
    );
  })

  return itemNodes;
}
