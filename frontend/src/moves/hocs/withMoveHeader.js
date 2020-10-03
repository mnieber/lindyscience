// @flow

import * as React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Display } from 'src/session/facets/Display';
import type { TagT } from 'src/tags/types';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import type { UserProfileT } from 'src/profiles/types';
import type { MoveListT } from 'src/move_lists/types';
import type { MoveT } from 'src/moves/types';
import { MoveListTitle } from 'src/move_lists/presentation/MoveListDetails';
import { FollowMoveListBtn } from 'src/move_lists/presentation/FollowMoveListBtn';
import { MoveHeader } from 'src/moves/presentation/MoveHeader';
import { Editing } from 'src/npm/facet-mobx/facets/editing';
import { mergeDefaultProps } from 'src/npm/mergeDefaultProps';

type PropsT = {
  moveTags: Array<TagT>,
  videoController: VideoController,
  defaultProps?: any,
};

type DefaultPropsT = {
  userProfile: ?UserProfileT,
  isOwner: (any) => boolean,
  display: Display,
  movesEditing: Editing,
  moveList: MoveListT,
  move: MoveT,
};

export const withMoveHeader = (WrappedComponent: any) =>
  observer((p: PropsT) => {
    const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

    const moveListTitle = <MoveListTitle moveList={props.moveList} />;

    const isOwnMove = !!props.move && props.isOwner(props.move);

    const editMoveBtn = (
      <FontAwesomeIcon
        key={'editMoveBtn' + (isOwnMove ? '_own' : '')}
        className={classnames('ml-2 text-lg', { hidden: !isOwnMove })}
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
    ) : undefined;

    const moveHeader = (
      <MoveHeader
        move={props.move}
        moveListTitle={moveListTitle}
        moveTags={props.moveTags}
        editMoveBtn={editMoveBtn}
        followMoveListBtn={followMoveListBtn}
        small={props.display.small}
      />
    );

    // $FlowFixMe
    return <WrappedComponent moveHeader={moveHeader} {...p} />;
  });