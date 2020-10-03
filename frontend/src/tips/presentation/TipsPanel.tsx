// @flow

import * as React from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';

import { OwnedObjectT, UUID } from 'src/kernel/types';
import { TipT } from 'src/tips/types';
import { VoteByIdT, VoteT } from 'src/votes/types';
import { UserProfileT } from 'src/profiles/types';
import { mergeDefaultProps } from 'src/npm/mergeDefaultProps';
import {
  useInsertTip,
  useNewTip,
  useSaveTip,
} from 'src/tips/bvrs/TipCrudBehaviours';
import { TipList } from 'src/tips/presentation/TipList';

type PropsT = {
  parentObject: OwnedObjectT;
  tips: Array<TipT>;
  voteByObjectId: VoteByIdT;
  saveTip: (TipT) => void;
  deleteTip: (TipT) => void;
  voteTip: (UUID, VoteT) => void;
  defaultProps?: any;
};

type DefaultPropsT = {
  userProfile: ?UserProfileT;
};

export const TipsPanel: React.FC<PropsT> = (p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  const insertTipBvr = useInsertTip(props.tips);
  const newTipBvr = useNewTip(
    props.userProfile ? props.userProfile.userId : -1,
    insertTipBvr,
    props.parentObject.id
  );
  const saveTipBvr = useSaveTip(
    newTipBvr,
    props.parentObject.id,
    insertTipBvr.preview,
    props.saveTip
  );

  const addTipBtn = (
    <FontAwesomeIcon
      key={'edit'}
      className={classnames('ml-2', { 'opacity-50': !props.userProfile })}
      icon={faPlusSquare}
      onClick={props.userProfile ? newTipBvr.add : undefined}
    />
  );

  return (
    <div className={'tipsPanel panel'}>
      <div className={'flexrow items-center flex-wrap mb-4'}>
        <h2 className="text-xl font-semibold">Tips</h2>
        {addTipBtn}
      </div>
      <TipList
        userProfile={props.userProfile}
        parentObject={props.parentObject}
        items={insertTipBvr.preview}
        setVote={props.voteTip}
        saveTip={saveTipBvr.save}
        deleteTip={props.deleteTip}
        cancelEditTip={saveTipBvr.discardChanges}
        voteByObjectId={props.voteByObjectId}
      />
    </div>
  );
};
