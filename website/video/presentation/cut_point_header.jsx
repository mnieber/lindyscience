// @flow

import * as React from "react";
import classnames from "classnames";

import { VideoController } from "screens/move_container/facets/video_controller";
import { secondsToTimeString } from "utils/utils";
import type { CutPointT } from "video/types";
import type { UUID } from "kernel/types";

type CutPointHeaderPropsT = {
  cutPoint: CutPointT,
  removeCutPoints: (Array<UUID>) => void,
  videoCtr: VideoController,
};

export function CutPointHeader(props: CutPointHeaderPropsT) {
  const onClickRemoveButton = e => {
    props.removeCutPoints([cutPoint.id]);
    e.preventDefault();
    e.stopPropagation();
  };

  const cutPoint = props.cutPoint;
  const label = cutPoint.type == "start" ? "Start at" : "End at";
  return (
    <div
      className={classnames("cutPointHeader", {
        "cutPointHeader--start": cutPoint.type == "start",
        "cutPointHeader--end": cutPoint.type == "end",
      })}
      onClick={() => props.videoCtr.player.seekTo(cutPoint.t)}
    >
      <div />
      <div className="self-center">
        {label + " " + secondsToTimeString(cutPoint.t)}
      </div>
      <div className="cutPointHeader__button" onClick={onClickRemoveButton}>
        X
      </div>
    </div>
  );
}
