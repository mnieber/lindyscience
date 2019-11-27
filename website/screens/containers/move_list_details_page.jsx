// @flow

import * as React from "react";
import { observer } from "mobx-react";
import classnames from "classnames";
import { compose } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

import type { UserProfileT } from "profiles/types";
import { withCutVideoPanel } from "screens/hocs/with_cut_video_panel";
import { withDefaultProps, mergeDefaultProps } from "facet/default_props";
import { FollowMoveListBtn } from "screens/presentation/follow_move_list_btn";
import { Editing } from "facet-mobx/facets/editing";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";
import type { MoveListT } from "move_lists/types";
import type { TagT } from "tags/types";

type PropsT = {
  moveListTags: Array<TagT>,
  cutVideoPanel: any,
  defaultProps: any,
};

type DefaultPropsT = {
  isOwner: any => boolean,
  moveList: MoveListT,
  moveListsEditing: Editing,
  moveListsPreview: Array<MoveListT>,
  userProfile: UserProfileT,
};

export const _MoveListDetailsPage = (p: PropsT) => {
  const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);

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

  return props.moveListsEditing.isEditing ? (
    <Widgets.MoveListForm
      moveList={props.moveList}
      autoFocus={true}
      knownTags={props.moveListTags}
      moveListSlugs={bannedMoveListSlugs}
      onSubmit={values => props.moveListsEditing.save(values)}
      onCancel={() => props.moveListsEditing.cancel()}
    />
  ) : (
    <div>
      <Widgets.MoveListDetails
        moveList={props.moveList}
        buttons={[editBtn, space, followMoveListBtn]}
      />
      {props.userProfile && props.cutVideoPanel}
    </div>
  );
};

// $FlowFixMe
const MoveListDetailsPage = compose(
  Ctr.connect(state => ({
    moveListTags: Ctr.fromStore.getMoveListTags(state),
  })),
  withDefaultProps,
  withCutVideoPanel,
  observer
)(_MoveListDetailsPage);

export default MoveListDetailsPage;
