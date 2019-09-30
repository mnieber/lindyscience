// @flow

import * as React from "react";
import classnames from "classnames";

import { roundDecimals } from "utils/utils2";

import type { CutPointT } from "video/types";
import type { UUID } from "kernel/types";

type CutPointHeaderPropsT = {
  cutPoint: CutPointT,
  removeCutPoint: UUID => void,
  videoPlayer: any,
};

export function CutPointHeader(props: CutPointHeaderPropsT) {
  const onClickRemoveButton = e => {
    props.removeCutPoint(cutPoint.id);
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
      onClick={() => props.videoPlayer.seekTo(cutPoint.t)}
    >
      <div />
      <div className="self-center">
        {label + " " + roundDecimals(cutPoint.t, 1)}
      </div>
      <div className="cutPointHeader__button" onClick={onClickRemoveButton}>
        X
      </div>
    </div>
  );
}
