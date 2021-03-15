import * as React from 'react';
import { observer } from 'mobx-react';

import { TipT } from 'src/tips/types';
import { VoteT } from 'src/votes/types';
import { TipForm } from 'src/tips/components/TipForm';
import { VoteCount } from 'src/votes/components/VoteCount';
import { useDefaultProps, FC } from 'react-default-props-context';
import { Editing } from 'skandha-facets/Editing';
import { Highlight } from 'skandha-facets/Highlight';
import { Addition } from 'skandha-facets/Addition';
import { Deletion } from 'skandha-facets/Deletion';
import { useStore } from 'src/app/components/StoreProvider';

type PropsT = {
  allowEdit: boolean;
  allowDelete: boolean;
  item: TipT;
};

type DefaultPropsT = {
  tipsHighlight: Highlight;
  tipsEditing: Editing;
  tipsAddition: Addition;
  tipsDeletion: Deletion;
};

export const Tip: FC<PropsT, DefaultPropsT> = observer((p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);
  const { votesStore } = useStore();
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
          onSubmit={(values: any) =>
            props.tipsEditing.save({ ...props.item, ...values })
          }
          onCancel={() => props.tipsEditing.cancel()}
        />
      </div>
    );
  } else {
    const voteCount = (
      <VoteCount
        vote={votesStore.voteByObjectId[tipId] || 0}
        count={props.item.voteCount}
        setVote={(value: VoteT) => votesStore.castVote(tipId, value)}
      />
    );

    const text = <div className="tip__text">{props.item.text}</div>;

    const editBtn = (
      <div
        className="tip__editButton ml-2"
        onClick={() => {
          props.tipsHighlight.highlightItem(tipId);
          props.tipsEditing.enable();
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
