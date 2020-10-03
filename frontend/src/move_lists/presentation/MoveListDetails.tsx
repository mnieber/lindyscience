// @flow

import * as React from 'react';
import classnames from 'classnames';

import type { MoveListT } from 'src/move_lists/types';
import { RouterLink } from 'src/utils/RouterLink';
import { RichTextEditor } from 'src/rich_text/presentation/RichTextEditor';
import { toReadOnlyEditorState } from 'src/rich_text/utils/EditorState';

// MoveListDetails

type MoveListTitlePropsT = {|
  moveList: MoveListT,
|};

export function MoveListTitle(props: MoveListTitlePropsT) {
  return (
    <div className="flexrow items-center">
      <RouterLink className="" to={`/people/${props.moveList.ownerUsername}`}>
        <h2 className="text-xl font-semibold">
          {props.moveList.ownerUsername}
        </h2>
      </RouterLink>
      <h2>/</h2>
      <RouterLink
        className=""
        to={`/lists/${props.moveList.ownerUsername}/${props.moveList.slug}`}
      >
        <h2 className="text-xl font-semibold">{props.moveList.name + '/'}</h2>
      </RouterLink>
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
