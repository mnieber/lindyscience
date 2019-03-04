// @flow

import * as React from 'react';
import classnames from 'classnames';
import { Link } from '@reach/router';
import { MoveForm } from 'moves/presentation/move_form';
import type { FlagT } from 'utils/hooks'
import type { MoveT, MoveListT, TagT } from 'moves/types'
import type { UserProfileT } from 'app/types'
import { difficulties } from 'utils/form_utils'


function Tags({
  tags
} : {
  tags : Array<TagT>
}) {
  const items = tags
    .map((tagName, idx) => {
      return <div key={idx} className="move__tag">{tagName}</div>;
    });

  return (
    <div className = {"move__tags"}>
      {items}
    </div>
  );
}


// Move

type StaticMovePropsT = {
  move: MoveT,
  moveList: MoveListT,
  moveTags: Array<TagT>,
  buttons?: Array<React.Node>,
  className?: string,
  tipsPanel: any,
  videoLinksPanel: any,
};

export function StaticMove(props: StaticMovePropsT) {
  const nameDiv =
    <div className="flex flex-row">
      <Link
        className=""
        to={`/app/list/${props.moveList.ownerUsername}/${props.moveList.slug}`}
      >
        <h1>{props.moveList.name}</h1>
      </Link>
      <div className={"move__name flexrow flex-wrap"}>
        <h1>: {props.move.name}</h1>
        {props.buttons}
      </div>
    </div>;

  const difficultyDiv =
    <div className={"move__difficulty panel"}>
      <h2>Difficulty</h2>
      {difficulties[props.move.difficulty]}
    </div>;

  const tagsDiv = props.move.tags.length
    ? <Tags tags={props.move.tags}/>
    : undefined;

  const descriptionDiv =
    <div className={"move__description panel"}>
      <h2>Description</h2>
      <div
        dangerouslySetInnerHTML={{__html: props.move.description}}
      />
    </div>;

  const privateNotesDiv =
    <div className={"move__privateNotes panel"}>
    <h2>Private notes</h2>
    </div>;

  return (
    <div className={classnames("move", props.className || "")}>
      {nameDiv}
      {difficultyDiv}
      {tagsDiv}
      {descriptionDiv}
      {privateNotesDiv}
      {props.tipsPanel}
      {props.videoLinksPanel}
    </div>
  );
}
