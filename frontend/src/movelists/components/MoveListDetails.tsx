import * as React from 'react';
import classnames from 'classnames';

import { Tags } from 'src/tags/components/Tags';
import { MoveListT } from 'src/movelists/types';
import { RouterLink } from 'src/utils/components/RouterLink';
import { RichTextEditor } from 'src/richtext/components/RichTextEditor';
import { toReadOnlyEditorState } from 'src/richtext/utils/EditorState';

// MoveListDetails

type MoveListTitlePropsT = {
  moveList: MoveListT;
};

export const MoveListTitle: React.FC<MoveListTitlePropsT> = (
  props: MoveListTitlePropsT
) => {
  return (
    <div className="flexrow items-center">
      {!props.moveList.isPrivate ? 'private' : ''}
      <RouterLink to={`/people/${props.moveList.ownerUsername}`}>
        <h2 className="text-xl font-semibold">
          {props.moveList.ownerUsername}
        </h2>
      </RouterLink>
      <h2>/</h2>
      <RouterLink
        to={`/lists/${props.moveList.ownerUsername}/${props.moveList.slug}`}
      >
        <h2 className="text-xl font-semibold">{props.moveList.name + '/'}</h2>
      </RouterLink>
    </div>
  );
};

type MoveListDetailsPropsT = {
  moveList: MoveListT;
  buttons: Array<any>;
};

export function MoveListDetails(props: MoveListDetailsPropsT) {
  const tagsDiv = props.moveList.tags.length ? (
    <Tags tags={props.moveList.tags} />
  ) : undefined;

  return (
    <div className={classnames('moveListDetails flexcol')}>
      <div className="flexrow items-center">
        <MoveListTitle moveList={props.moveList} />
        {props.buttons}
      </div>
      {tagsDiv}
      <RichTextEditor
        key={props.moveList.id}
        initialEditorState={toReadOnlyEditorState(props.moveList.description)}
        readOnly={true}
        autoFocus={false}
      />
    </div>
  );
}
