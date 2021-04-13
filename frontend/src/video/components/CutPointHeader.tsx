import * as React from 'react';
import classnames from 'classnames';

import { CutPointT } from 'src/video/types';
import { UUID } from 'src/kernel/types';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { secondsToTimeString } from 'src/utils/utils';

import './CutPointHeader.scss';

type PropsT = {
  cutPoint: CutPointT;
  removeCutPoints: (uuids: Array<UUID>) => void;
  videoController: VideoController;
};

export const CutPointHeader: React.FC<PropsT> = (props: PropsT) => {
  const onClickRemoveButton = (e: any) => {
    props.removeCutPoints([cutPoint.id]);
    e.preventDefault();
    e.stopPropagation();
  };

  const cutPoint = props.cutPoint;
  const label = cutPoint.type === 'start' ? 'Start at' : 'End at';
  return (
    <div
      className={classnames('CutPointHeader', {
        'CutPointHeader--start': cutPoint.type === 'start',
        'CutPointHeader--end': cutPoint.type === 'end',
      })}
      onClick={() => props.videoController.player.seekTo(cutPoint.t)}
    >
      <div />
      <div className="self-center">
        {label + ' ' + secondsToTimeString(cutPoint.t)}
      </div>
      <div className="CutPointHeader__Button" onClick={onClickRemoveButton}>
        X
      </div>
    </div>
  );
};
