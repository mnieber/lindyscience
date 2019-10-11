// @flow

import * as React from "react";
import classnames from "classnames";
import { compose } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

import { apiSaveMove } from "moves/api";
import { apiSaveMoveOrdering } from "move_lists/api";

import { createErrorHandler, isOwner } from "app/utils";
import { isNone } from "utils/utils2";
import { actInsertMoveIds } from "move_lists/actions";
import { actAddMoves } from "moves/actions";
import { withFollowMoveListBtn } from "screens/hocs/with_follow_move_list_btn";
import {
  actAddCutPoints,
  actClearCutPoints,
  actRemoveCutPoints,
  actSetCutVideoLink,
} from "video/actions";
import { createMoveFromCutPoint } from "screens/utils";
import { MoveListCrudBvrsContext } from "screens/bvrs/move_list_crud_behaviours";
import { withCutVideoBvr } from "screens/hocs/with_cut_video_bvr";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";

import type { CutPointT, VideoBvrT } from "video/types";
import type { MoveListCrudBvrsT } from "screens/types";
import type { MoveListT } from "move_lists/types";
import type { TagT } from "tags/types";
import type { UserProfileT } from "profiles/types";
import type { EditCutPointBvrT } from "video/bvrs/cut_point_crud_behaviours";
import type { UUID } from "kernel/types";

type MoveListDetailsPagePropsT = {
  userProfile: UserProfileT,
  moveListTags: Array<TagT>,
  moveTags: Array<TagT>,
  moveList: MoveListT,
  allMoveLists: Array<MoveListT>,
  cutVideoLink: string,
  videoBvr: VideoBvrT,
  editCutPointBvr: EditCutPointBvrT,
  followMoveListBtn: any,
  cutPoints: Array<CutPointT>,
  dispatch: Function,
};

type _MoveListDetailsPagePropsT = MoveListDetailsPagePropsT & {
  moveListCrudBvrs: MoveListCrudBvrsT,
};

function _createCutPointBvrs(props: _MoveListDetailsPagePropsT) {
  return {
    removeCutPoints: cutPointIds =>
      props.dispatch(actRemoveCutPoints(cutPointIds)),
    saveCutPoint: (values: any) => {
      const cutPoint = props.cutPoints.find(x => x.id == values.id);
      if (!!cutPoint) {
        props.dispatch(actAddCutPoints([{ ...cutPoint, ...values }]));
      }
    },
    createMovesFromCutPoints: () => {
      const newMoves = props.cutPoints.reduce((acc, cutPoint) => {
        if (cutPoint.type == "end") {
          const lastMoveIdx = acc.length - 1;
          const lastMove = acc.length ? acc[lastMoveIdx] : undefined;
          return lastMove && isNone(lastMove.endTimeMs)
            ? [
                ...acc.slice(0, lastMoveIdx),
                { ...lastMove, endTimeMs: cutPoint.t * 1000 },
              ]
            : acc;
        } else {
          const newMove = createMoveFromCutPoint(
            cutPoint,
            props.userProfile,
            props.cutVideoLink,
            props.moveList
          );
          return [...acc, newMove];
        }
      }, []);

      const lastMoveIdx = props.moveList.moves.length - 1;
      const lastMoveId =
        lastMoveIdx >= 0 ? props.moveList.moves[lastMoveIdx] : "";

      props.dispatch(actAddMoves(newMoves));
      const moveIdsInMoveList = props.dispatch(
        actInsertMoveIds(
          newMoves.map(x => x.id),
          props.moveList.id,
          lastMoveId,
          false
        )
      );

      newMoves.forEach(newMove => {
        apiSaveMove(newMove).catch(
          createErrorHandler("We could not save the move")
        );
        apiSaveMoveOrdering(props.moveList.id, moveIdsInMoveList).catch(
          createErrorHandler("We could not update the movelist")
        );
      });
    },
  };
}

export function _MoveListDetailsPage(props: _MoveListDetailsPagePropsT) {
  if (!props.moveList) {
    return <React.Fragment />;
  }

  const moveListSlugs = props.allMoveLists
    .filter(x => isOwner(props.userProfile, x.ownerId))
    .map(x => x.slug);

  const isOwned = isOwner(props.userProfile, props.moveList.ownerId);

  const editBtn = (
    <FontAwesomeIcon
      key={1}
      className={classnames("ml-2", { hidden: !isOwned })}
      icon={faEdit}
      onClick={() => props.moveListCrudBvrs.setIsEditing(true)}
    />
  );

  const space = <div key="space" className="flex flex-grow" />;

  const div = props.moveListCrudBvrs.isEditing ? (
    <Widgets.MoveListForm
      autoFocus={true}
      knownTags={props.moveListTags}
      moveList={props.moveList}
      moveListSlugs={moveListSlugs}
      onSubmit={values =>
        props.moveListCrudBvrs.editMoveListBvr.finalize(false, values)
      }
      onCancel={() =>
        props.moveListCrudBvrs.editMoveListBvr.finalize(true, null)
      }
    />
  ) : (
    <Widgets.MoveListDetails
      userProfile={props.userProfile}
      moveList={props.moveList}
      buttons={[editBtn, space, props.followMoveListBtn]}
    />
  );

  const cutPointBvrs = _createCutPointBvrs(props);

  return (
    <div>
      {div}
      <Widgets.CutVideoPanel
        moveTags={props.moveTags}
        actSetCutVideoLink={link => props.dispatch(actSetCutVideoLink(link))}
        cutVideoLink={props.cutVideoLink}
        videoBvr={props.videoBvr}
        cutPoints={props.cutPoints}
        cutPointBvrs={cutPointBvrs}
      />
    </div>
  );
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
        </div>
      )}
    </MoveListCrudBvrsContext.Consumer>
  );
}

// $FlowFixMe
MoveListDetailsPage = compose(
  withCutVideoBvr,
  withFollowMoveListBtn,
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
    moveList: Ctr.fromStore.getSelectedMoveList(state),
    allMoveLists: Ctr.fromStore.getMoveLists(state),
    moveListTags: Ctr.fromStore.getMoveListTags(state),
    moveTags: Ctr.fromStore.getMoveTags(state),
    cutVideoLink: Ctr.fromStore.getCutVideoLink(state),
    cutPoints: Ctr.fromStore.getCutPoints(state),
  }))
)(MoveListDetailsPage);

export default MoveListDetailsPage;
