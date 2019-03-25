// @flow

import * as React from "react";
import MovesCtr from "moves/containers/index";
import AppCtr from "app/containers/index";

import Widgets from "moves/presentation/index";
import { isOwner } from "app/utils";

import { MoveListCrudBvrsContext } from "moves/containers/move_list_crud_behaviours";

import type { UserProfileT, TagT } from "app/types";
import type { MoveListT, MoveListCrudBvrsT } from "moves/types";

type MoveListDetailsPagePropsT = {
  userProfile: UserProfileT,
  moveListTags: Array<TagT>,
  moveList: MoveListT,
  // receive any actions as well
};

type _MoveListDetailsPagePropsT = MoveListDetailsPagePropsT & {
  moveListCrudBvrs: MoveListCrudBvrsT,
};

function _createStaticMoveListDetails(
  moveList: MoveListT,
  props: _MoveListDetailsPagePropsT
) {
  return (
    <Widgets.MoveListDetails
      userProfile={props.userProfile}
      moveList={moveList}
    />
  );
}

function _createOwnMoveListDetails(
  moveList: MoveListT,
  props: _MoveListDetailsPagePropsT
) {
  const editBtn = (
    <div
      className={"button button--wide ml-2"}
      onClick={() => props.moveListCrudBvrs.setIsEditing(true)}
      key={1}
    >
      Edit
    </div>
  );

  const div = props.moveListCrudBvrs.isEditing ? (
    <Widgets.MoveListForm
      autoFocus={true}
      knownTags={props.moveListTags}
      moveList={moveList}
      onSubmit={props.moveListCrudBvrs.saveMoveListBvr.saveItem}
      onCancel={props.moveListCrudBvrs.saveMoveListBvr.discardChanges}
    />
  ) : (
    _createStaticMoveListDetails(moveList, props)
  );

  return (
    <div>
      {!props.moveListCrudBvrs.isEditing && editBtn}
      {div}
    </div>
  );
}

export function _MoveListDetailsPage(props: _MoveListDetailsPagePropsT) {
  const actions: any = props;

  if (!props.moveList) {
    return <React.Fragment />;
  }

  return isOwner(props.userProfile, props.moveList.ownerId)
    ? _createOwnMoveListDetails(props.moveList, props)
    : _createStaticMoveListDetails(props.moveList, props);
}

export function MoveListDetailsPage(props: MoveListDetailsPagePropsT) {
  return (
    <MoveListCrudBvrsContext.Consumer>
      {moveListCrudBvrs => (
        <_MoveListDetailsPage {...props} moveListCrudBvrs={moveListCrudBvrs} />
      )}
    </MoveListCrudBvrsContext.Consumer>
  );
}

// $FlowFixMe
MoveListDetailsPage = MovesCtr.connect(
  state => ({
    userProfile: AppCtr.fromStore.getUserProfile(state),
    moveList: MovesCtr.fromStore.getSelectedMoveList(state),
    moveListTags: MovesCtr.fromStore.getMoveListTags(state),
  }),
  {
    ...AppCtr.actions,
    ...MovesCtr.actions,
  }
)(MoveListDetailsPage);

export default MoveListDetailsPage;
