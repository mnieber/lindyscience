// @flow

import * as React from "react";
import YouTube from "react-youtube";

// $FlowFixMe
import uuidv4 from "uuid/v4";
import { VideoPlayerPanel } from "video/presentation/video_player";

import type { VideoBvrT } from "video/types";

type CutVideoPanelPropsT = {
  cutVideoLink: string,
  actSetCutVideoLink: Function,
  videoBvr: VideoBvrT,
};

export function CutVideoPanel(props: CutVideoPanelPropsT) {
  const onKeyDown = e => {
    if (e.keyCode == 13) {
      props.actSetCutVideoLink(e.target.value);
    }
  };

  const linkPanel = <input className="w-full" onKeyDown={onKeyDown} />;

  const videoPlayerPanel = (
    <VideoPlayerPanel
      key="videoPlayerPanel"
      videoBvr={props.videoBvr}
      restartId={""}
    />
  );

  return (
    <div>
      <div className={"cutVideoPanel panel"}>
        {linkPanel}
        {videoPlayerPanel}
      </div>
    </div>
  );
}
