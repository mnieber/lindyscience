// @flow

import * as React from "react";
import { observer } from "mobx-react";
import classnames from "classnames";
import { compose } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

import { createErrorHandler } from "app/utils";
import type { CutPointT } from "video/types";
import { Video } from "video/bvrs/use_video";
import type { MoveListT } from "move_lists/types";
import { withDefaultProps, mergeDefaultProps } from "screens/default_props";
import type { UserProfileT } from "profiles/types";
import { FollowMoveListBtn } from "screens/presentation/follow_move_list_btn";
import { Editing } from "facet-mobx/facets/editing";
import {
  actAddCutPoints,
  actRemoveCutPoints,
  actSetCutVideoLink,
} from "video/actions";
import { apiSaveMove } from "moves/api";
import { apiSaveMoveOrdering } from "move_lists/api";
import { isNone } from "utils/utils";
import { actInsertMoveIds } from "move_lists/actions";
import { actAddMoves } from "moves/actions";
import { createMoveFromCutPoint } from "screens/utils";
import { withCutVideoBvr } from "screens/hocs/with_cut_video_bvr";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";
import type { TagT } from "tags/types";
import type { EditCutPointBvrT } from "video/bvrs/cut_point_crud_behaviours";

type MoveListDetailsPagePropsT = {
  moveListTags: Array<TagT>,
  moveTags: Array<TagT>,
  cutVideoLink: string,
  videoBvr: Video,
  editCutPointBvr: EditCutPointBvrT,
  cutPoints: Array<CutPointT>,
  dispatch: Function,
  defaultProps: any,
} & {
  // default props
  isOwner: any => boolean,
  moveList: MoveListT,
  moveListsEditing: Editing,
  moveListsPreview: Array<MoveListT>,
  userProfile: ?UserProfileT,
};

export const _MoveListDetailsPage = (p: MoveListDetailsPagePropsT) => {
  const props = mergeDefaultProps(p);

  if (!props.moveList) {
    return <React.Fragment />;
  }

  const bannedMoveListSlugs = props.moveListsPreview
    .filter(x => props.isOwner(x))
    .filter(x => x.id !== props.moveList.id)
    .map(x => x.slug);

  const editBtn = (
    <FontAwesomeIcon
      key={1}
      className={classnames("ml-2", {
        hidden: !props.isOwner(props.moveList),
      })}
      icon={faEdit}
      onClick={() => props.moveListsEditing.setIsEditing(true)}
    />
  );

  const followMoveListBtn = (
    <FollowMoveListBtn
      key="followMoveListBtn"
      defaultProps={props.defaultProps}
    />
  );
  const space = <div key="space" className="flex flex-grow" />;

  const div = props.moveListsEditing.isEditing ? (
    <Widgets.MoveListForm
      moveList={props.moveList}
      autoFocus={true}
      knownTags={props.moveListTags}
      moveListSlugs={bannedMoveListSlugs}
      onSubmit={values => props.moveListsEditing.save(values)}
      onCancel={() => props.moveListsEditing.cancel()}
    />
  ) : (
    <Widgets.MoveListDetails
      moveList={props.moveList}
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
        } else if (props.userProfile) {
          const newMove = createMoveFromCutPoint(
            cutPoint,
            props.userProfile,
            props.cutVideoLink,
            props.moveList
          );
          return [...acc, newMove];
        } else {
          return acc;
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
};

// $FlowFixMe
const MoveListDetailsPage = compose(
  withCutVideoBvr,
  Ctr.connect(state => ({
    moveListTags: Ctr.fromStore.getMoveListTags(state),
    moveTags: Ctr.fromStore.getMoveTags(state),
    cutVideoLink: Ctr.fromStore.getCutVideoLink(state),
    cutPoints: Ctr.fromStore.getCutPoints(state),
  })),
  withDefaultProps,
  observer
)(_MoveListDetailsPage);

export default MoveListDetailsPage;
