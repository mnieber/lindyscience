// @flow

import * as React from "react";
import { VoteCount } from "app/presentation/vote_count";
import { TipForm } from "moves/presentation/tip_form";
import type { UUID, VoteByIdT, VoteT } from "app/types";
import type { TipT } from "moves/types";

// Tip
type TipPropsT = {
  item: TipT,
  vote: VoteT,
  setVote: (UUID, VoteT) => void,
  saveTip: Function,
  cancelEditTip: Function,
};

export function Tip(props: TipPropsT) {
  const [isEditing, setIsEditing] = React.useState(props.item.text == "");

  if (isEditing) {
    function _submitValues(values) {
      props.saveTip(props.item.id, values);
      setIsEditing(false);
    }

    function _onCancel() {
      props.cancelEditTip(props.item.id);
      setIsEditing(false);
    }

    const form = (
      <TipForm
        values={{
          text: props.item.text,
        }}
        onSubmit={_submitValues}
        onCancel={_onCancel}
      />
    );

    return <div className="tip">{form}</div>;
  } else {
    function _setVote(value) {
      props.setVote(props.item.id, value);
    }

    const voteCount = (
      <VoteCount
        vote={props.vote}
        count={props.item.voteCount}
        setVote={_setVote}
      />
    );

    const text = <div className="tip__text">{props.item.text}</div>;

    const editBtn = (
      <div className="tip__editButton ml-2" onClick={() => setIsEditing(true)}>
        edit
      </div>
    );

    return (
      <div className="tip">
        {voteCount}
        {text}
        {editBtn}
      </div>
    );
  }
}

// TipList

type TipListPropsT = {
  items: Array<TipT>,
  voteByObjectId: VoteByIdT,
  setVote: (UUID, VoteT) => void,
  saveTip: Function,
  cancelEditTip: Function,
};

export function TipList(props: TipListPropsT) {
  const itemNodes: Array<React.Node> = props.items.map((item, idx) => {
    return (
      <Tip
        key={item.id}
        item={item}
        vote={props.voteByObjectId[item.id] || 0}
        setVote={props.setVote}
        saveTip={props.saveTip}
        cancelEditTip={props.cancelEditTip}
      />
    );
  });

  return itemNodes;
}
