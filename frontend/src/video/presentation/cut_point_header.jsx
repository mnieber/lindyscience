// @flow

import * as React from 'react';
import classnames from 'classnames';

import { VideoController } from 'src/screens/move_container/facets/video_controller';
import { secondsToTimeString } from 'src/utils/utils';
import type { CutPointT } from 'src/video/types';
import type { UUID } from 'src/kernel/types';

type PropsT = {
  cutPoint: CutPointT,
  removeCutPoints: (Array<UUID>) => void,
  videoController: VideoController,
};

export function CutPointHeader(props: PropsT) {
  const onClickRemoveButton = (e) => {
    props.removeCutPoints([cutPoint.id]);
    e.preventDefault();
    e.stopPropagation();
  };

  const cutPoint = props.cutPoint;
  const label = cutPoint.type == 'start' ? 'Start at' : 'End at';
  return (
    <div
      className={classnames('cutPointHeader', {
        'cutPointHeader--start': cutPoint.type == 'start',
        'cutPointHeader--end': cutPoint.type == 'end',
      })}
      onClick={() => props.videoController.player.seekTo(cutPoint.t)}
    >
      <div />
      <div className="self-center">
        {label + ' ' + secondsToTimeString(cutPoint.t)}
      </div>
      <div className="cutPointHeader__button" onClick={onClickRemoveButton}>
        X
      </div>
    </div>
  );
}
