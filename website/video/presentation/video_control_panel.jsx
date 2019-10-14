// @flow

import * as React from "react";
import classnames from "classnames";

import type { VideoBvrT } from "video/types";

type VideoControlPanelPropsT = {
  videoBvr: VideoBvrT,
};

export function VideoControlPanel(props: VideoControlPanelPropsT) {
  const _state = x => (x ? "enabled" : "disabled");

  return (
    <div className="flexcol">
      <button
        className={classnames(
          "videoControlPanel__button--" + _state(props.videoBvr.isPlaying)
        )}
        onClick={props.videoBvr.togglePlay}
      >
        Play
      </button>
    </div>
  );
}
