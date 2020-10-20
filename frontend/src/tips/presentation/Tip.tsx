import * as React from 'react';

import { apiDeleteTip } from 'src/tips/api';
import { createErrorHandler } from 'src/app/utils';
import { TipT } from 'src/tips/types';
import { VoteT } from 'src/votes/types';
import { TipForm } from 'src/tips/presentation/TipForm';
import { VoteCount } from 'src/votes/presentation/VoteCount';
import { mergeDefaultProps } from 'react-default-props-context';
import { Editing } from 'facet-mobx/facets/editing';
import { Highlight } from 'facet-mobx/facets/highlight';
import { Selection } from 'facet-mobx/facets/selection';
import { Addition } from 'facet-mobx/facets/addition';
import { VotesStore } from 'src/votes/VotesStore';
import { TipsStore } from 'src/tips/TipsStore';

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
  tipsStore: TipsStore;
};

export function Tip(p: PropsT) {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);
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
          props.tipsSelection.selectItem({
            itemId: tipId,
          });
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
          props.tipsStore.removeTips([tipId]);
          apiDeleteTip(tipId).catch(
            createErrorHandler('We could not delete the tip')
          );
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
