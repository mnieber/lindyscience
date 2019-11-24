// @flow

import { CutVideoContainer } from "screens/cut_video_container/cut_video_container";

export function getCutVideoCtrDefaultProps(cutVideoCtr: CutVideoContainer) {
  return {
    videoCtr: () => cutVideoCtr.cutPoints.videoCtr,
    cutPoints: () => cutVideoCtr.cutPoints,
    moveDisplay: () => cutVideoCtr.display,
  };
}
