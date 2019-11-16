// @flow

import { MoveContainer } from "screens/move_container/move_container";

export function getMoveCtrDefaultProps(moveCtr: MoveContainer) {
  return {
    moveCtr: () => moveCtr,
    moveDisplay: () => moveCtr.display,
    videoCtr: () => moveCtr.videoCtr,
    timePoints: () => moveCtr.timePoints,
  };
}
