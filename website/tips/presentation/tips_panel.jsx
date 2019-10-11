// @flow

import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";

import {
  useInsertTip,
  useNewTip,
  useSaveTip,
} from "tips/bvrs/tip_crud_behaviours";
import { TipList } from "tips/presentation/tip";

import type { UUID, OwnedObjectT } from "kernel/types";
import type { UserProfileT } from "profiles/types";
import type { VoteT, VoteByIdT } from "votes/types";
import type { TipT } from "tips/types";

type TipsPanelPropsT = {
  parentObject: OwnedObjectT,
  userProfile: ?UserProfileT,
  tips: Array<TipT>,
  voteByObjectId: VoteByIdT,
  saveTip: TipT => void,
  deleteTip: TipT => void,
  voteTip: (UUID, VoteT) => void,
};

export function TipsPanel(props: TipsPanelPropsT) {
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
      key={"edit"}
      className="ml-2"
      icon={faPlusSquare}
      onClick={newTipBvr.add}
    />
  );

  return (
    <div className={"tipsPanel panel"}>
      <div className={"flexrow items-center flex-wrap mb-4"}>
        <h2>Tips</h2>
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
}
