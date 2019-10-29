// @flow

import * as React from "react";
import classnames from "classnames";
import { compose } from "redux";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

import type { UserProfileT } from "profiles/types";
import type { MoveListT } from "move_lists/types";
import type { MoveT } from "moves/types";
import { mergeDefaultProps, withDefaultProps } from "screens/default_props";
import { FollowMoveListBtn } from "screens/presentation/follow_move_list_btn";
import type { TagT } from "tags/types";
import type { VideoBvrT } from "video/types";
import { withHostedMovePanels } from "screens/hocs/with_hosted_move_panels";
import { MoveListTitle } from "move_lists/presentation/move_list_details";
import { VideoPlayerPanel } from "video/presentation/video_player";
import { Editing } from "facet-mobx/facets/editing";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";

type PropsT = {
  moveTags: Array<TagT>,
  hostedMovePanels: any,
  videoBvr: VideoBvrT,
  defaultProps: any,
} & {
  // default props
  movesEditing: Editing,
  userProfile: ?UserProfileT,
  isOwner: any => boolean,
  moveList: MoveListT,
  move: MoveT,
};

// $FlowFixMe
export const withMoveDiv = compose(
  withHostedMovePanels,
  Ctr.connect(state => ({
    moveTags: Ctr.fromStore.getMoveTags(state),
  })),
  withDefaultProps,
  observer,
  (WrappedComponent: any) => (p: PropsT) => {
    const props = mergeDefaultProps(p);

    const { moveTags, hostedMovePanels, ...passThroughProps }: PropsT = props;
    const isOwnMove = !!props.move && props.isOwner(props.move);
    const moveListTitle = <MoveListTitle moveList={props.moveList} />;

    const editMoveBtn = (
      <FontAwesomeIcon
        key={"editMoveBtn" + (isOwnMove ? "_own" : "")}
        className={classnames("ml-2 text-lg", { hidden: !isOwnMove })}
        size="lg"
        icon={faEdit}
        onClick={() => props.movesEditing.setIsEditing(true)}
      />
    );

    const videoPlayerPanel = (
      <VideoPlayerPanel
        key="videoPlayerPanel"
        videoBvr={props.videoBvr}
        restartId={props.move ? props.move.id : ""}
      />
    );

    const space = <div key="space" className={classnames("flex flex-grow")} />;

    const followMoveListButtons = props.userProfile
      ? [
          <FollowMoveListBtn
            key="followMoveListBtn"
            defaultProps={props.defaultProps}
          />,
        ]
      : [];

    const moveDiv = props.movesEditing.isEditing ? (
      <div>
        {videoPlayerPanel}
        <Widgets.MoveForm
          autoFocus={true}
          move={props.move}
          onSubmit={values => props.movesEditing.save(values)}
          onCancel={() => props.movesEditing.cancel()}
          knownTags={moveTags}
          videoPlayer={props.videoBvr.player}
        />
      </div>
    ) : (
      <div>
        <Widgets.MoveHeader
          move={props.move}
          moveListTitle={moveListTitle}
          moveTags={moveTags}
          buttons={[editMoveBtn, space, ...followMoveListButtons]}
        />
        {videoPlayerPanel}
        <Widgets.Move move={props.move} videoPlayer={props.videoBvr.player} />
        {hostedMovePanels}
      </div>
    );

    return <WrappedComponent moveDiv={moveDiv} {...passThroughProps} />;
  }
);
