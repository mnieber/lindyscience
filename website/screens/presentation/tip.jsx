// @flow

import * as React from "react";
import { VoteCount } from "votes/presentation/vote_count";
import { TipForm } from "screens/presentation/tip_form";
import type { UUID } from "kernel/types";
import type { UserProfileT } from "profiles/types";
import type { VoteByIdT, VoteT } from "votes/types";
import type { MoveT } from "moves/types";
import type { TipT } from "screens/types";

// Tip
type TipPropsT = {
  isOwner: boolean,
  item: TipT,
  vote: VoteT,
  setVote: (UUID, VoteT) => void,
  saveTip: Function,
  deleteTip: Function,
  cancelEditTip: Function,
};

export function Tip(props: TipPropsT) {
  const [isEditing, setIsEditing] = React.useState(props.item.text == "");
  const [armDelete, setArmDelete] = React.useState(false);

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

    const deleteBtn = (
      <div className="tip__editButton ml-2" onClick={() => setArmDelete(true)}>
        delete...
      </div>
    );

    const confirmDeleteBtn = (
      <div
        className="tip__editButton mx-1"
        onClick={() => {
          props.deleteTip(props.item);
          setArmDelete(false);
        }}
      >
        confirm
      </div>
    );

    const cancelDeleteBtn = (
      <div className="tip__editButton mx-1" onClick={() => setArmDelete(false)}>
        cancel
      </div>
    );

    const cancelConfirmDiv = (
      <div className="ml-2 px-2 flexrow bg-red-light content-center">
        {confirmDeleteBtn}
        {cancelDeleteBtn}
      </div>
    );

    return (
      <div className="tip">
        {voteCount}
        {text}
        {props.isOwner && editBtn}
        {!armDelete && props.isOwner && deleteBtn}
        {armDelete && props.isOwner && cancelConfirmDiv}
      </div>
    );
  }
}

// TipList

type TipListPropsT = {
  userProfile: UserProfileT,
  move: MoveT,
  items: Array<TipT>,
  voteByObjectId: VoteByIdT,
  setVote: (UUID, VoteT) => void,
  saveTip: Function,
  deleteTip: Function,
  cancelEditTip: Function,
};

export function TipList(props: TipListPropsT) {
  const itemNodes: Array<React.Node> = props.items.map((item, idx) => {
    const isOwner =
      item.ownerId == props.userProfile.userId ||
      props.move.ownerId == props.userProfile.userId;

    return (
      <Tip
        key={item.id}
        item={item}
        isOwner={isOwner}
        vote={props.voteByObjectId[item.id] || 0}
        setVote={props.setVote}
        saveTip={props.saveTip}
        deleteTip={props.deleteTip}
        cancelEditTip={props.cancelEditTip}
      />
    );
  });

  return itemNodes;
}
