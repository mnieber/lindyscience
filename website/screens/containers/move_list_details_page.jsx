// @flow

import { compose } from "redux";
import * as React from "react";

import { MoveListCrudBvrsContext } from "screens/bvrs/move_list_crud_behaviours";
import { actClearCutPoints, actSetCutVideoLink } from "video/actions";
import { isOwner } from "app/utils";
import { withCutVideoBvr } from "screens/hocs/with_cut_video_bvr";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";

import type { CutPointT, VideoBvrT } from "video/types";
import type { MoveListCrudBvrsT } from "screens/types";
import type { MoveListT } from "move_lists/types";
import type { TagT } from "tags/types";
import type { UserProfileT } from "profiles/types";
import type { EditCutPointBvrT } from "video/bvrs/cut_point_crud_behaviours";

type MoveListDetailsPagePropsT = {
  userProfile: UserProfileT,
  moveListTags: Array<TagT>,
  moveTags: Array<TagT>,
  moveList: MoveListT,
  cutVideoLink: string,
  videoBvr: VideoBvrT,
  editCutPointBvr: EditCutPointBvrT,
  cutPoints: Array<CutPointT>,
  dispatch: Function,
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
      onSubmit={values =>
        props.moveListCrudBvrs.editMoveListBvr.finalize(false, values)
      }
      onCancel={() =>
        props.moveListCrudBvrs.editMoveListBvr.finalize(true, null)
      }
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
        <div>
          <_MoveListDetailsPage
            {...props}
            moveListCrudBvrs={moveListCrudBvrs}
          />
          <Widgets.CutVideoPanel
            moveTags={props.moveTags}
            actSetCutVideoLink={x => props.dispatch(actSetCutVideoLink(x))}
            cutVideoLink={props.cutVideoLink}
            videoBvr={props.videoBvr}
            cutPoints={props.cutPoints}
          />
        </div>
      )}
    </MoveListCrudBvrsContext.Consumer>
  );
}

// $FlowFixMe
MoveListDetailsPage = compose(
  withCutVideoBvr,
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
    moveList: Ctr.fromStore.getSelectedMoveList(state),
    moveListTags: Ctr.fromStore.getMoveListTags(state),
    moveTags: Ctr.fromStore.getMoveTags(state),
    cutVideoLink: Ctr.fromStore.getCutVideoLink(state),
    cutPoints: Ctr.fromStore.getCutPoints(state),
  }))
)(MoveListDetailsPage);

export default MoveListDetailsPage;
