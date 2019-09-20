// @flow

import * as React from "react";
import classnames from "classnames";
import urlParser from "js-video-url-parser";

import type { VideoT, VideoBvrT } from "video/types";

type VideoControlPanelPropsT = {
  videoBvr: VideoBvrT,
  setIsEditing: boolean => void,
};

export function VideoControlPanel(props: VideoControlPanelPropsT) {
  const _state = x => (x ? "enabled" : "disabled");

  const _setStartTime = () => {
    if (props.videoBvr.player) {
      props.videoBvr.setProposedStartTime(
        props.videoBvr.player.getCurrentTime()
      );
      props.setIsEditing(true);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        className={classnames(
          "videoControlPanel__button--" + _state(props.videoBvr.isPlaying)
        )}
        onClick={props.videoBvr.togglePlay}
      >
        Play
      </button>
      <button onClick={_setStartTime}>Set start time</button>
    </div>
  );
}
