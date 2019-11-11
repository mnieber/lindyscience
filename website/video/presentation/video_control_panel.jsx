// @flow

import * as React from "react";
import classnames from "classnames";

import { Video } from "video/bvrs/use_video";
import { runInAction } from "utils/mobx_wrapper";

type VideoControlPanelPropsT = {
  videoBvr: Video,
};

export function VideoControlPanel(props: VideoControlPanelPropsT) {
  const _state = x => (x ? "enabled" : "disabled");

  return (
    <div className="flexcol">
      <button
        className={classnames(
          "videoControlPanel__button--" + _state(props.videoBvr.isPlaying)
        )}
        onClick={() => {
          runInAction(() => {
            props.videoBvr.isPlaying = !props.videoBvr.isPlaying;
          });
        }}
      >
        Play
      </button>
    </div>
  );
}
