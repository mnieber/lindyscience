// @flow

import * as React from "react";
import { observer } from "mobx-react";
import classnames from "classnames";
import { compose } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

import { FollowMoveListBtn } from "screens/presentation/follow_move_list_btn";
import type { UserProfileT } from "profiles/types";
import { Highlight } from "screens/data_containers/bvrs/highlight";
import { Editing } from "screens/data_containers/bvrs/editing";
import {
  actAddCutPoints,
  actRemoveCutPoints,
  actSetCutVideoLink,
} from "video/actions";
import { withMoveListsCtr } from "screens/data_containers/movelists_container_context";
import { MoveListsContainer } from "screens/data_containers/movelists_container";
import { apiSaveMove } from "moves/api";
import { apiSaveMoveOrdering } from "move_lists/api";
import { createErrorHandler, isOwner } from "app/utils";
import { isNone } from "utils/utils";
import { actInsertMoveIds } from "move_lists/actions";
import { actAddMoves } from "moves/actions";
import { createMoveFromCutPoint } from "screens/utils";
import { withCutVideoBvr } from "screens/hocs/with_cut_video_bvr";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";
import type { CutPointT, VideoBvrT } from "video/types";
import type { TagT } from "tags/types";
import type { EditCutPointBvrT } from "video/bvrs/cut_point_crud_behaviours";

type MoveListDetailsPagePropsT = {
  userProfile: ?UserProfileT,
  moveListTags: Array<TagT>,
  moveTags: Array<TagT>,
  cutVideoLink: string,
  videoBvr: VideoBvrT,
  editCutPointBvr: EditCutPointBvrT,
  cutPoints: Array<CutPointT>,
  dispatch: Function,
  moveListsCtr: MoveListsContainer,
};

type _MoveListDetailsPagePropsT = MoveListDetailsPagePropsT;

export function MoveListDetailsPage(props: _MoveListDetailsPagePropsT) {
  const ctr = props.moveListsCtr;
  const moveList = Highlight.get(ctr).item;
  const moveLists = ctr.data.preview;
  const userProfile = props.userProfile;
  const isEditing = Editing.get(ctr).isEditing;

  if (!moveList) {
    return <React.Fragment />;
  }

  const bannedMoveListSlugs = moveLists
    .filter(x => userProfile && isOwner(userProfile, x.ownerId))
    .filter(x => x !== moveList)
    .map(x => x.slug);

  const isOwned = userProfile && isOwner(userProfile, moveList.ownerId);

  const editBtn = (
    <FontAwesomeIcon
      key={1}
      className={classnames("ml-2", { hidden: !isOwned })}
      icon={faEdit}
      onClick={() => Editing.get(ctr).setIsEditing(true)}
    />
  );

  const followMoveListBtn = <FollowMoveListBtn />;
  const space = <div key="space" className="flex flex-grow" />;

  const div = isEditing ? (
    <Widgets.MoveListForm
      autoFocus={true}
      knownTags={props.moveListTags}
      moveList={moveList}
      moveListSlugs={bannedMoveListSlugs}
      onSubmit={values => Editing.get(ctr).save(values)}
      onCancel={() => Editing.get(ctr).cancel()}
    />
  ) : (
    <Widgets.MoveListDetails
      userProfile={userProfile}
      moveList={moveList}
      buttons={[editBtn, space, followMoveListBtn]}
    />
  );

  const cutPointBvrs = {
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
        } else if (userProfile) {
          const newMove = createMoveFromCutPoint(
            cutPoint,
            userProfile,
            props.cutVideoLink,
            moveList
          );
          return [...acc, newMove];
        } else {
          return acc;
        }
      }, []);

      const lastMoveIdx = moveList.moves.length - 1;
      const lastMoveId = lastMoveIdx >= 0 ? moveList.moves[lastMoveIdx] : "";

      props.dispatch(actAddMoves(newMoves));
      const moveIdsInMoveList = props.dispatch(
        actInsertMoveIds(
          newMoves.map(x => x.id),
          moveList.id,
          lastMoveId,
          false
        )
      );

      newMoves.forEach(newMove => {
        apiSaveMove(newMove).catch(
          createErrorHandler("We could not save the move")
        );
        apiSaveMoveOrdering(moveList.id, moveIdsInMoveList).catch(
          createErrorHandler("We could not update the movelist")
        );
      });
    },
  };

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

// $FlowFixMe
MoveListDetailsPage = compose(
  withMoveListsCtr,
  withCutVideoBvr,
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
    moveListTags: Ctr.fromStore.getMoveListTags(state),
    moveTags: Ctr.fromStore.getMoveTags(state),
    cutVideoLink: Ctr.fromStore.getCutVideoLink(state),
    cutPoints: Ctr.fromStore.getCutPoints(state),
  })),
  observer
)(MoveListDetailsPage);

export default MoveListDetailsPage;
