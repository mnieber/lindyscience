// @flow

import * as React from "react";
import YouTube from "react-youtube";

import { VideoPlayerPanel } from "video/presentation/video_player";
import { CutPointList } from "video/presentation/cut_point_list";

import type { CutPointT, VideoBvrT, CutPointBvrsT } from "video/types";
import type { TagT } from "tags/types";

type CutVideoPanelPropsT = {
  moveTags: Array<TagT>,
  cutVideoLink: string,
  actSetCutVideoLink: Function,
  videoBvr: VideoBvrT,
  cutPoints: Array<CutPointT>,
  cutPointBvrs: CutPointBvrsT,
};

export function CutVideoPanel(props: CutVideoPanelPropsT) {
  const onKeyDown = e => {
    if (e.keyCode == 13) {
      props.actSetCutVideoLink(e.target.value);
    }
  };

  const linkPanel = (
    <div className="flex flex-row h-8">
      <input
        id="linkPanelInput"
        className="w-full"
        onKeyDown={onKeyDown}
        placeholder="Video link"
      />
    </div>
  );

  const videoPlayerPanel = (
    <VideoPlayerPanel
      key="videoPlayerPanel"
      videoBvr={props.videoBvr}
      restartId={""}
    />
  );

  const selectCutPointById = (id, isShift, isCtrl) => undefined;

  const cutPointList = (
    <CutPointList
      moveTags={props.moveTags}
      cutPoints={props.cutPoints}
      highlightedCutPoint={null}
      selectCutPointById={selectCutPointById}
      videoPlayer={props.videoBvr.player}
      cutPointBvrs={props.cutPointBvrs}
    />
  );

  const buttonCreateMoves = (
    <button
      onClick={() => {
        props.cutPointBvrs.createMovesFromCutPoints();
        props.cutPointBvrs.removeCutPoints(props.cutPoints.map(x => x.id));
      }}
    >
      Create moves
    </button>
  );
  return (
    <div>
      <div className={"cutVideoPanel panel"}>
        {linkPanel}
        {videoPlayerPanel}
        {buttonCreateMoves}
        {cutPointList}
      </div>
    </div>
  );
}
