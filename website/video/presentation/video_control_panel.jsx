// @flow

import * as React from "react";
import classnames from "classnames";

import { VideoController } from "screens/move_container/facets/video_controller";
import { runInAction } from "utils/mobx_wrapper";

type VideoControlPanelPropsT = {
  videoCtr: VideoController,
};

export function VideoControlPanel(props: VideoControlPanelPropsT) {
  const _state = x => (x ? "enabled" : "disabled");

  return (
    <div className="flexcol">
      <button
        className={classnames(
          "videoControlPanel__button--" + _state(props.videoCtr.isPlaying)
        )}
        onClick={() => {
          runInAction(() => {
            props.videoCtr.isPlaying = !props.videoCtr.isPlaying;
          });
        }}
      >
        Play
      </button>
    </div>
  );
}
