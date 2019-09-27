// @flow

import * as React from "react";
import YouTube from "react-youtube";

import { VideoPlayerPanel } from "video/presentation/video_player";
import { CutPointList } from "video/presentation/cut_point_list";

import type { CutPointT, VideoBvrT } from "video/types";

type CutVideoPanelPropsT = {
  cutVideoLink: string,
  actSetCutVideoLink: Function,
  videoBvr: VideoBvrT,
  cutPoints: Array<CutPointT>,
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

  // $FlowFixMe
  const cutPointList = <CutPointList cutPoints={props.cutPoints} />;

  return (
    <div>
      <div className={"cutVideoPanel panel"}>
        {linkPanel}
        {videoPlayerPanel}
        {cutPointList}
      </div>
    </div>
  );
}
