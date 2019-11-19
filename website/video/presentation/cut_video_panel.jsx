// @flow

import * as React from "react";

import { Display } from "screens/session_container/facets/display";
import type { CutPointT, CutPointBvrsT } from "video/types";
import { VideoController } from "screens/move_container/facets/video_controller";
import { VideoPlayerPanel } from "video/presentation/video_player_panel";
import { CutPointList } from "video/presentation/cut_point_list";
import type { TagT } from "tags/types";

type CutVideoPanelPropsT = {
  moveTags: Array<TagT>,
  cutVideoLink: string,
  actSetCutVideoLink: Function,
  videoCtr: VideoController,
  cutPoints: Array<CutPointT>,
  cutPointBvrs: CutPointBvrsT,
  display: Display,
};

export function CutVideoPanel(props: CutVideoPanelPropsT) {
  const onKeyDown = e => {
    if (e.keyCode == 13) {
      props.actSetCutVideoLink(e.target.value);
    }
  };

  const linkPanel = (
    <div className="flexrow h-8">
      <input
        id="linkPanelInput"
        className="w-full"
        onKeyDown={onKeyDown}
        placeholder="VideoController link"
      />
    </div>
  );

  const videoPlayerPanel = (
    <VideoPlayerPanel
      key="videoPlayerPanel"
      videoCtr={props.videoCtr}
      display={props.display}
    />
  );

  const selectCutPointById = (id, isShift, isCtrl) => undefined;

  const cutPointList = (
    <CutPointList
      moveTags={props.moveTags}
      cutPoints={props.cutPoints}
      highlightedCutPoint={null}
      selectCutPointById={selectCutPointById}
      videoCtr={props.videoCtr}
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
