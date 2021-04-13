import * as React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { MoveT } from 'src/moves/types';
import { MoveDescriptionEditor } from 'src/moves/components/MoveDescriptionEditor';
import { RouterLink } from 'src/utils/components/RouterLink';

import './Move.scss';

type PropsT = {
  move: MoveT;
  className?: string;
  videoController?: any;
};

export const Move: React.FC<PropsT> = observer((props: PropsT) => {
  const descriptionDiv = (
    <React.Fragment>
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
        <RouterLink
          className="ml-2 mb-2"
          to={'/people/' + props.move.ownerUsername}
        >
          {props.move.ownerUsername}
        </RouterLink>
      </div>
    </React.Fragment>
  );

  return (
    <div className={classnames('Move', props.className || '')}>
      {descriptionDiv}
    </div>
  );
});
