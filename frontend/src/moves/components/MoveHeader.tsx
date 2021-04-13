import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { useDefaultProps, FC } from 'react-default-props-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { Editing } from 'skandha-facets/Editing';

import { MoveT } from 'src/moves/types';
import { Tags } from 'src/tags/components/Tags';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { MoveListT } from 'src/movelists/types';
import { Display as SessionDisplay } from 'src/session/Display';
import { MoveListTitle } from 'src/movelists/components/MoveListDetails';
import { FollowMoveListBtn } from 'src/movelists/components/FollowMoveListBtn';
import { useStore } from 'src/app/components/StoreProvider';

// MoveHeader

type PropsT = {};

type DefaultPropsT = {
  sessionDisplay: SessionDisplay;
  movesEditing: Editing;
  moveList: MoveListT;
  move: MoveT;
  videoController: VideoController;
};

export const MoveHeader: FC<PropsT, DefaultPropsT> = observer((p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);
  const { profilingStore } = useStore();

  const small = props.sessionDisplay.small;
  const moveListTitle = <MoveListTitle moveList={props.moveList} />;

  const isOwnMove = !!props.move && profilingStore.isOwner(props.move);

  const editMoveBtn = (
    <FontAwesomeIcon
      key={'editMoveBtn' + (isOwnMove ? '_own' : '')}
      className={classnames('ml-2 text-lg', { hidden: !isOwnMove })}
      size="lg"
      icon={faEdit}
      onClick={() => props.movesEditing.enable()}
    />
  );

  const followMoveListBtn = profilingStore.userProfile ? (
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
