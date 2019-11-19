// @flow

import * as React from "react";
import { observer } from "mobx-react";
import { compose } from "redux";

import { CutVideoPanel } from "video/presentation/cut_video_panel";
import { Display } from "screens/session_container/facets/display";
import { createErrorHandler } from "app/utils";
import { VideoController } from "screens/move_container/facets/video_controller";
import { withDefaultProps, mergeDefaultProps } from "screens/default_props";
import { FollowMoveListBtn } from "screens/presentation/follow_move_list_btn";
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
import Ctr from "screens/containers/index";
import type { CutPointT } from "video/types";
import type { MoveListT } from "move_lists/types";
import type { UserProfileT } from "profiles/types";
import type { TagT } from "tags/types";
import type { EditCutPointBvrT } from "video/bvrs/cut_point_crud_behaviours";

type PropsT = {
  moveTags: Array<TagT>,
  cutVideoLink: string,
  videoCtr: VideoController,
  editCutPointBvr: EditCutPointBvrT,
  cutPoints: Array<CutPointT>,
  dispatch: Function,
  defaultProps: any,
};

type DefaultPropsT = {
  display: Display,
  moveList: MoveListT,
  userProfile: ?UserProfileT,
};

export const _CutVideoPage = (p: PropsT) => {
  const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);

  const followMoveListBtn = (
    <FollowMoveListBtn
      key="followMoveListBtn"
      defaultProps={props.defaultProps}
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
    <CutVideoPanel
      moveTags={props.moveTags}
      actSetCutVideoLink={link => props.dispatch(actSetCutVideoLink(link))}
      cutVideoLink={props.cutVideoLink}
      videoCtr={props.videoCtr}
      cutPoints={props.cutPoints}
      cutPointBvrs={cutPointBvrs}
      display={props.display}
    />
  );
};

// $FlowFixMe
const CutVideoPage = compose(
  Ctr.connect(state => ({
    moveTags: Ctr.fromStore.getMoveTags(state),
    cutVideoLink: Ctr.fromStore.getCutVideoLink(state),
    cutPoints: Ctr.fromStore.getCutPoints(state),
  })),
  withDefaultProps,
  observer
)(_CutVideoPage);

export default CutVideoPage;
