import * as React from 'react';
import { observer } from 'mobx-react';

import { TipT } from 'src/tips/types';
import { VoteT } from 'src/votes/types';
import { TipForm } from 'src/tips/presentation/TipForm';
import { VoteCount } from 'src/votes/presentation/VoteCount';
import { mergeDefaultProps, FC } from 'react-default-props-context';
import { Editing } from 'facet-mobx/facets/editing';
import { Highlight } from 'facet-mobx/facets/highlight';
import { Selection } from 'facet-mobx/facets/selection';
import { Addition } from 'facet-mobx/facets/addition';
import { Deletion } from 'facet-mobx/facets/deletion';
import { VotesStore } from 'src/votes/VotesStore';

type PropsT = {
  allowEdit: boolean;
  allowDelete: boolean;
  item: TipT;
};

type DefaultPropsT = {
  tipsHighlight: Highlight;
  tipsSelection: Selection;
  tipsEditing: Editing;
  tipsAddition: Addition;
  votesStore: VotesStore;
  tipsDeletion: Deletion;
};

export const Tip: FC<PropsT, DefaultPropsT> = observer((p: PropsT) => {
  const props = mergeDefaultProps<PropsT, DefaultPropsT>(p);
  const [armDelete, setArmDelete] = React.useState(false);
  const tipId = props.item.id;
  const isEditing =
    props.tipsEditing.isEditing && props.tipsHighlight.id === tipId;

  if (isEditing) {
    return (
      <div className="tip">
        <TipForm
          values={{
            text: props.item.text,
          }}
          onSubmit={(values: any) => props.tipsEditing.save(values)}
          onCancel={() => props.tipsEditing.cancel()}
        />
      </div>
    );
  } else {
    const voteCount = (
      <VoteCount
        vote={props.votesStore.voteByObjectId[tipId] || 0}
        count={props.item.voteCount}
        setVote={(value: VoteT) => props.votesStore.castVote(tipId, value)}
      />
    );

    const text = <div className="tip__text">{props.item.text}</div>;

    const editBtn = (
      <div
        className="tip__editButton ml-2"
        onClick={() => {
          props.tipsSelection.selectItem({ itemId: tipId });
          props.tipsEditing.setIsEditing(true);
        }}
      >
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
          props.tipsDeletion.delete([tipId]);
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
});
