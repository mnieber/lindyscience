// @flow

import * as React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import { MoveDescriptionEditor } from 'src/moves/presentation/move_description_editor';
import type { MoveT } from 'src/moves/types';

// Move

type PropsT = {
  move: MoveT,
  className?: string,
  videoController?: any,
};

export const Move: (PropsT) => any = observer((props: PropsT) => {
  const descriptionDiv = (
    <div>
      <div id="move__description" className={'move__description panel'}>
        <h2 className="text-xl font-semibold">Description</h2>
        <MoveDescriptionEditor
          editorId={'move_' + props.move.id}
          description={props.move.description}
          readOnly={true}
          autoFocus={false}
          videoController={props.videoController}
        />
      </div>
      <div className="flexrow">
        Created by:
        <Link
          className="ml-2 mb-2"
          to={'/app/people/' + props.move.ownerUsername}
        >
          {props.move.ownerUsername}
        </Link>
      </div>
    </div>
  );

  return (
    <div className={classnames('move', props.className || '')}>
      {descriptionDiv}
    </div>
  );
});
