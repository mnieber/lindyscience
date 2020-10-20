import * as React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Display } from 'src/session/facets/Display';
import { TagT } from 'src/tags/types';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { UserProfileT } from 'src/profiles/types';
import { MoveListT } from 'src/move_lists/types';
import { MoveT } from 'src/moves/types';
import { MoveListTitle } from 'src/move_lists/presentation/MoveListDetails';
import { FollowMoveListBtn } from 'src/move_lists/presentation/FollowMoveListBtn';
import { MoveHeader } from 'src/moves/presentation/MoveHeader';
import { Editing } from 'facet-mobx/facets/editing';
import { useDefaultProps } from 'react-default-props-context';

type PropsT = {
  moveTags: Array<TagT>;
  videoController: VideoController;
};

type DefaultPropsT = {
  userProfile?: UserProfileT;
  isOwner: (move: MoveT) => boolean;
  display: Display;
  movesEditing: Editing;
  moveList: MoveListT;
  move: MoveT;
};

export const withMoveHeader = (WrappedComponent: any) =>
  observer((p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

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
      <FollowMoveListBtn key="followMoveListBtn" />
    ) : undefined;

    const moveHeader = (
      <MoveHeader
        move={props.move}
        moveListTitle={moveListTitle}
        // moveTags={props.moveTags}
        editMoveBtn={editMoveBtn}
        followMoveListBtn={followMoveListBtn}
        small={props.display.small}
      />
    );

    return <WrappedComponent moveHeader={moveHeader} {...p} />;
  });
