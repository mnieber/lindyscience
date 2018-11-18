// @flow

import * as React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { MoveForm } from 'moves/presentation/move_form';
import type { FlagT } from 'utils/hooks'
import type { MoveT, TagT } from 'moves/types'
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

export function StaticMove({
  move,
  moveTags,
  buttons=[],
  className="",
}: {
  move: MoveT,
  moveTags: Array<TagT>,
  buttons?: Array<React.Node>,
  className?: string,
}) {
  const nameDiv =
    <div className= {"move__name flexrow flex-wrap"}>
      <h1>{move.name}</h1>
      {buttons}
    </div>;

  const difficultyDiv =
    <div className={"move__difficulty panel"}>
      <h2>Difficulty</h2>
      {difficulties[move.difficulty]}
    </div>;

  const tagsDiv = move.tags.length
    ? <Tags tags={move.tags}/>
    : undefined;

  const descriptionDiv =
    <div className={"move__description panel"}>
      <h2>Description</h2>
      <div
        dangerouslySetInnerHTML={{__html: move.description}}
      />
    </div>;

  const privateNotesDiv =
    <div className={"move__privateNotes panel"}>
    <h2>Private notes</h2>
    </div>;

  const videoLinksPanel = <VideoLinksPanel moveId={move.id}/>;
  const tipsPanel = <TipsPanel moveId={move.id}/>;

  return (
    <div className={classnames("move", className)}>
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

export function EditableMove({
  move,
  moveTags,
  saveMove,
  cancelEditMove,
  isEditing,
  setEditingEnabled,
  buttons=[],
  className="",
  autoFocus=true,
}: {|
  move: MoveT,
  moveTags: Array<TagT>,
  saveMove: Function,
  cancelEditMove: Function,
  isEditing: boolean,
  setEditingEnabled: Function,
  buttons?: Array<React.Node>,
  className?: string,
  autoFocus?: boolean,
|}) {
  if (isEditing) {
    return (
      <div>
        <MoveForm
          autoFocus={autoFocus}
          move={move}
          onSubmit={saveMove}
          onCancel={cancelEditMove}
          knownTags={moveTags}
        />
      </div>
    );
  }
  else {
    const editMoveBtn =
      <div
        className={"move__editBtn button button--wide ml-2"}
        onClick={setEditingEnabled}
        key={1}
      >
      Edit move
      </div>;

    return (
      <StaticMove
        move={move}
        moveTags={moveTags}
        buttons={[editMoveBtn]}
        className={className}
      />
    );
  }
}
