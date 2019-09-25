// @flow

import * as React from "react";
import Ctr from "screens/containers/index";

import Widgets from "screens/presentation/index";
import { isOwner } from "app/utils";

import { MoveListCrudBvrsContext } from "screens/bvrs/move_list_crud_behaviours";

import type { UserProfileT } from "profiles/types";
import type { TagT } from "tags/types";
import type { MoveListT } from "move_lists/types";
import type { MoveListCrudBvrsT } from "screens/types";

type MoveListDetailsPagePropsT = {
  userProfile: UserProfileT,
  moveListTags: Array<TagT>,
  moveList: MoveListT,
  cutVideoLink: string,
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
  const actions: any = props;

  return (
    <MoveListCrudBvrsContext.Consumer>
      {moveListCrudBvrs => (
        <div>
          <_MoveListDetailsPage
            {...props}
            moveListCrudBvrs={moveListCrudBvrs}
          />
          <Widgets.CutVideoPanel
            actSetCutVideoLink={actions.actSetCutVideoLink}
            cutVideoLink={props.cutVideoLink}
          />
        </div>
      )}
    </MoveListCrudBvrsContext.Consumer>
  );
}

// $FlowFixMe
MoveListDetailsPage = Ctr.connect(
  state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
    moveList: Ctr.fromStore.getSelectedMoveList(state),
    moveListTags: Ctr.fromStore.getMoveListTags(state),
    cutVideoLink: Ctr.fromStore.getCurVideoLink(state),
  }),
  Ctr.actions
)(MoveListDetailsPage);

export default MoveListDetailsPage;
