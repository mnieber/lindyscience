import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

import { MoveListForm } from 'src/move_lists/presentation/MoveListForm';
import { MoveListDetails } from 'src/move_lists/presentation/MoveListDetails';
import { mergeDefaultProps, withDefaultProps } from 'src/npm/mergeDefaultProps';
import { Profiling } from 'src/session/facets/Profiling';
import { MoveListT } from 'src/move_lists/types';
import { Editing } from 'src/npm/facet-mobx/facets/editing';
import { UserProfileT } from 'src/profiles/types';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { withCutVideoPanel } from 'src/video/hocs/withCutVideoPanel';
import { FollowMoveListBtn } from 'src/move_lists/presentation/FollowMoveListBtn';

type PropsT = {
  defaultProps?: any;
};

type DefaultPropsT = {
  profiling: Profiling;
  moveList: MoveListT;
  moveListsEditing: Editing;
  moveListsPreview: Array<MoveListT>;
  userProfile: UserProfileT;
  moveListsStore: MoveListsStore;
  cutVideoPanel: any;
};

export const MoveListDetailsPage: React.FC<PropsT> = compose(
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
    <MoveListForm
      moveList={props.moveList}
      autoFocus={true}
      knownTags={Object.keys(props.moveListsStore.tags)}
      moveListSlugs={bannedMoveListSlugs}
      onSubmit={(values) => props.moveListsEditing.save(values)}
      onCancel={() => props.moveListsEditing.cancel()}
    />
  ) : (
    <div>
      <MoveListDetails
        moveList={props.moveList}
        buttons={[editBtn, space, followMoveListBtn]}
      />
      {props.userProfile && props.cutVideoPanel}
    </div>
  );
});
