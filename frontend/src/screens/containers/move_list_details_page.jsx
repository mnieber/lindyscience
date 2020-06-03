// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

import { Profiling } from 'src/screens/session_container/facets/profiling';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import type { UserProfileT } from 'src/profiles/types';
import { withCutVideoPanel } from 'src/screens/hocs/with_cut_video_panel';
import { withDefaultProps, mergeDefaultProps } from 'src/mergeDefaultProps';
import { FollowMoveListBtn } from 'src/screens/presentation/follow_move_list_btn';
import { Editing } from 'src/facet-mobx/facets/editing';
import Widgets from 'src/screens/presentation/index';
import type { MoveListT } from 'src/move_lists/types';

type PropsT = {
  defaultProps?: any,
};

type DefaultPropsT = {
  profiling: Profiling,
  moveList: MoveListT,
  moveListsEditing: Editing,
  moveListsPreview: Array<MoveListT>,
  userProfile: UserProfileT,
  moveListsStore: MoveListsStore,
  cutVideoPanel: any,
};

export const MoveListDetailsPage: (PropsT) => any = compose(
  withDefaultProps,
  withCutVideoPanel,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  if (!props.moveList) {
    return <React.Fragment />;
  }

  const bannedMoveListSlugs = props.moveListsPreview
    .filter((x) => props.profiling.isOwner(x))
    .filter((x) => x.id !== props.moveList.id)
    .map((x) => x.slug);

  const editBtn = (
    <FontAwesomeIcon
      key={1}
      className={classnames('ml-2', {
        hidden: !props.profiling.isOwner(props.moveList),
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
      knownTags={Object.keys(props.moveListsStore.tags)}
      moveListSlugs={bannedMoveListSlugs}
      onSubmit={(values) => props.moveListsEditing.save(values)}
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
});
