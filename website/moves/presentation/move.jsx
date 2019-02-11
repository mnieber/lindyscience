// @flow

import * as React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { MoveForm } from 'moves/presentation/move_form';
import type { FlagT } from 'utils/hooks'
import type { MoveT, MoveListT, TagT } from 'moves/types'
import VideoLinksPanel from 'moves/containers/videolinkspanel'
import TipsPanel from 'moves/containers/tipspanel'
import { difficulties } from 'utils/form_utils'


export function MoveHeader() {
  return (
    <div className = {"move__header"}>
      <Link to='/app/moves'>All moves</Link>
    </div>
  );
}


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
};

export function StaticMove(props: StaticMovePropsT) {
  const nameDiv =
    <div className="flex flex-row">
      <Link className="" href="."><h1>{props.moveList.name}</h1></Link>
      <div className={"move__name flexrow flex-wrap"}>
        <h1>: {props.move.name}</h1>
        {props.buttons}
      </div>;
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

  const videoLinksPanel = <VideoLinksPanel moveId={props.move.id}/>;
  const tipsPanel = <TipsPanel moveId={props.move.id}/>;

  return (
    <div className={classnames("move", props.className || "")}>
      {nameDiv}
      {difficultyDiv}
      {tagsDiv}
      {descriptionDiv}
      {privateNotesDiv}
      {tipsPanel}
      {videoLinksPanel}
    </div>
  );
}

// EditableMove

type EditableMovePropsT = {|
  move: MoveT,
  moveList: MoveListT,
  moveTags: Array<TagT>,
  saveMove: Function,
  cancelEditMove: Function,
  isEditing: boolean,
  setEditingEnabled: Function,
  buttons?: Array<React.Node>,
  className?: string,
  autoFocus?: boolean,
|};

export function EditableMove(props: EditableMovePropsT) {
  if (props.isEditing) {
    return (
      <div>
        <MoveForm
          autoFocus={props.autoFocus}
          move={props.move}
          onSubmit={props.saveMove}
          onCancel={props.cancelEditMove}
          knownTags={props.moveTags}
        />
      </div>
    );
  }
  else {
    const editMoveBtn =
      <div
        className={"move__editBtn button button--wide ml-2"}
        onClick={props.setEditingEnabled}
        key={1}
      >
      Edit move
      </div>;

    return (
      <StaticMove
        move={props.move}
        moveList={props.moveList}
        moveTags={props.moveTags}
        buttons={[editMoveBtn]}
        className={props.className}
      />
    );
  }
}
