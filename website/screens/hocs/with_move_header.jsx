// @flow

import * as React from "react";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react";

import { Display } from "screens/session_container/facets/display";
import { FollowMoveListBtn } from "screens/presentation/follow_move_list_btn";
import { MoveHeader } from "moves/presentation/move_header";
import { VideoController } from "screens/move_container/facets/video_controller";
import { Editing } from "facet-mobx/facets/editing";
import { mergeDefaultProps } from "facet/default_props";
import { MoveListTitle } from "move_lists/presentation/move_list_details";
import type { UserProfileT } from "profiles/types";
import type { MoveListT } from "move_lists/types";
import type { TagT } from "tags/types";
import type { MoveT } from "moves/types";

type PropsT = {
  moveTags: Array<TagT>,
  videoCtr: VideoController,
  defaultProps: any,
};

type DefaultPropsT = {
  userProfile: ?UserProfileT,
  isOwner: any => boolean,
  display: Display,
  movesEditing: Editing,
  moveList: MoveListT,
  move: MoveT,
};

export const withMoveHeader = (WrappedComponent: any) =>
  observer((p: PropsT) => {
    const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);
    const { moveTags, ...passThroughProps }: PropsT = props;

    const moveListTitle = <MoveListTitle moveList={props.moveList} />;

    const isOwnMove = !!props.move && props.isOwner(props.move);
    const editMoveBtn = (
      <FontAwesomeIcon
        key={"editMoveBtn" + (isOwnMove ? "_own" : "")}
        className={classnames("ml-2 text-lg", { hidden: !isOwnMove })}
        size="lg"
        icon={faEdit}
        onClick={() => props.movesEditing.setIsEditing(true)}
      />
    );

    const followMoveListBtn = props.userProfile ? (
      <FollowMoveListBtn
        key="followMoveListBtn"
        defaultProps={props.defaultProps}
      />
    ) : (
      undefined
    );

    const moveHeader = (
      <MoveHeader
        move={props.move}
        moveListTitle={moveListTitle}
        moveTags={moveTags}
        editMoveBtn={editMoveBtn}
        followMoveListBtn={followMoveListBtn}
        small={props.display.small}
      />
    );

    return <WrappedComponent moveHeader={moveHeader} {...passThroughProps} />;
  });
