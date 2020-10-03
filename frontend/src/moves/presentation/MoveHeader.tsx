// @flow

import * as React from 'react';
import classnames from 'classnames';

import type { MoveT } from 'src/moves/types';
import { Tags } from 'src/tags/presentation/Tags';

// MoveHeader

type PropsT = {
  move: MoveT,
  moveListTitle: any,
  editMoveBtn: any,
  followMoveListBtn: any,
  small: boolean,
};

export function MoveHeader(props: PropsT) {
  const space = <div key="space" className={classnames('flex flex-grow')} />;

  const nameDiv = (
    <div
      className={classnames('items-center w-full', {
        flexrow: !props.small,
        flexcol: props.small,
      })}
    >
      {props.moveListTitle}
      <div
        className={classnames('flexrow items-center', {
          'flex-grow': true,
        })}
      >
        {props.small && props.editMoveBtn}
        <h1 className="ml-2 text-2xl move__name text-center">
          {props.move.name}
        </h1>
        {!props.small && props.editMoveBtn}
        {!props.small && space}
        {!props.small && props.followMoveListBtn}
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
}
