// @flow

import * as React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import { RichTextEditor } from 'src/rich_text/presentation/rich_text_editor';
import { toReadOnlyEditorState } from 'src/rich_text/utils/editor_state';
import type { MoveListT } from 'src/move_lists/types';

// MoveListDetails

type MoveListTitlePropsT = {|
  moveList: MoveListT,
|};

export function MoveListTitle(props: MoveListTitlePropsT) {
  return (
    <div className="flexrow items-center">
      <Link className="" to={`/app/people/${props.moveList.ownerUsername}`}>
        <h2 className="text-xl font-semibold">
          {props.moveList.ownerUsername}
        </h2>
      </Link>
      <h2>/</h2>
      <Link
        className=""
        to={`/app/lists/${props.moveList.ownerUsername}/${props.moveList.slug}`}
      >
        <h2 className="text-xl font-semibold">{props.moveList.name + '/'}</h2>
      </Link>
    </div>
  );
}

type MoveListDetailsPropsT = {|
  moveList: MoveListT,
  buttons: Array<any>,
|};

export function MoveListDetails(props: MoveListDetailsPropsT) {
  return (
    <div className={classnames('moveListDetails flexcol')}>
      <div className="flexrow items-center">
        <MoveListTitle moveList={props.moveList} />
        {props.buttons}
      </div>
      <RichTextEditor
        key={props.moveList.id}
        initialEditorState={toReadOnlyEditorState(props.moveList.description)}
        readOnly={true}
        autoFocus={false}
      />
    </div>
  );
}
