import * as React from 'react';
import classnames from 'classnames';

import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { runInAction } from 'src/utils/mobx_wrapper';

type PropsT = {
  videoController: VideoController;
};

export function VideoControlPanel(props: PropsT) {
  const _state = (x) => (x ? 'enabled' : 'disabled');

  return (
    <div className="flexcol">
      <button
        className={classnames(
          'videoControlPanel__button--' +
            _state(props.videoController.isPlaying)
        )}
        onClick={() => {
          runInAction(() => {
            props.videoController.isPlaying = !props.videoController.isPlaying;
          });
        }}
      >
        Play
      </button>
    </div>
  );
}
