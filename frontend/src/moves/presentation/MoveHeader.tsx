import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { useDefaultProps, FC } from 'react-default-props-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { Editing } from 'facet-mobx/facets/Editing';

import { MoveT } from 'src/moves/types';
import { Tags } from 'src/tags/presentation/Tags';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { MoveListT } from 'src/move_lists/types';
import { UserProfileT } from 'src/profiles/types';
import { Display } from 'src/session/facets/Display';
import { MoveListTitle } from 'src/move_lists/presentation/MoveListDetails';
import { FollowMoveListBtn } from 'src/move_lists/presentation/FollowMoveListBtn';

// MoveHeader

type PropsT = {};

type DefaultPropsT = {
  userProfile?: UserProfileT;
  isOwner: (move: MoveT) => boolean;
  display: Display;
  movesEditing: Editing;
  moveList: MoveListT;
  move: MoveT;
  videoController: VideoController;
};

export const MoveHeader: FC<PropsT, DefaultPropsT> = observer((p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);

  const small = props.display.small;
  const moveListTitle = <MoveListTitle moveList={props.moveList} />;

  const isOwnMove = !!props.move && props.isOwner(props.move);

  const editMoveBtn = (
    <FontAwesomeIcon
      key={'editMoveBtn' + (isOwnMove ? '_own' : '')}
      className={classnames('ml-2 text-lg', { hidden: !isOwnMove })}
      size="lg"
      icon={faEdit}
      onClick={() => props.movesEditing.enable()}
    />
  );

  const followMoveListBtn = props.userProfile ? (
    <FollowMoveListBtn key="followMoveListBtn" />
  ) : undefined;

  const space = <div key="space" className={classnames('flex flex-grow')} />;
  const nameDiv = (
    <div
      className={classnames('items-center w-full', {
        flexrow: !small,
        flexcol: small,
      })}
    >
      {moveListTitle}
      <div
        className={classnames('flexrow items-center', {
          'flex-grow': true,
        })}
      >
        {small && editMoveBtn}
        <h1 className="ml-2 text-2xl move__name text-center">
          {props.move.name}
        </h1>
        {!small && editMoveBtn}
        {!small && space}
        {!small && followMoveListBtn}
      </div>
    </div>
  );

  const tagsDiv = props.move.tags.length ? (
    <Tags tags={props.move.tags} />
  ) : undefined;

  return (
    <div className={classnames('move__header')}>
      {nameDiv}
      {tagsDiv}
    </div>
  );
});
