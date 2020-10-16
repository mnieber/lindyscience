import * as React from 'react';

import { TipT } from 'src/tips/types';
import { VoteT } from 'src/votes/types';
import { UUID } from 'src/kernel/types';
import { TipForm } from 'src/tips/presentation/TipForm';
import { VoteCount } from 'src/votes/presentation/VoteCount';

type PropsT = {
  allowEdit: boolean;
  allowDelete: boolean;
  item: TipT;
  vote: VoteT;
  setVote: (id: UUID, vote: VoteT) => void;
  saveTip: Function;
  deleteTip: Function;
  cancelEditTip: Function;
};

export function Tip(props: PropsT) {
  const [isEditing, setIsEditing] = React.useState(props.item.text === '');
  const [armDelete, setArmDelete] = React.useState(false);

  if (isEditing) {
    const _submitValues = (values: any) => {
      props.saveTip(props.item.id, values);
      setIsEditing(false);
    };

    const _onCancel = () => {
      props.cancelEditTip(props.item.id);
      setIsEditing(false);
    };

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
    const _setVote = (value: VoteT) => {
      props.setVote(props.item.id, value);
    };

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
      <div className="Tip">
        {voteCount}
        {text}
        {props.allowEdit && editBtn}
        {!armDelete && props.allowDelete && deleteBtn}
        {armDelete && props.allowDelete && cancelConfirmDiv}
      </div>
    );
  }
}
