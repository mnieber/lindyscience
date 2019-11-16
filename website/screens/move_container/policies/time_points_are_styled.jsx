// @flow

import jQuery from "jquery";
import { scrollIntoView } from "app/utils";

import { MoveContainer } from "screens/move_container/move_container";

function styleTimePoints(videoPlayer: any, timePoints: Array<number>) {
  const currentTime = videoPlayer ? videoPlayer.getCurrentTime() : -1;
  let hasScrolled = false;

  timePoints.forEach(tp => {
    const className = ".tp-" + (tp + "").replace(".", "-");
    const elms = jQuery(className);
    elms.removeClass("bg-yellow");
    if (currentTime - 1 < tp && tp < currentTime + 1) {
      elms.addClass("bg-yellow");
      if (elms.length && !hasScrolled) {
        hasScrolled = true;
        scrollIntoView(elms[0], document.getElementById("move__description"));
      }
    }
  });
}

export function timePointsAreStyled(ctr: MoveContainer) {
  setInterval(() => {
    const player = ctr.videoCtr.getPlayer();
    ctr.timePoints.updateFrom(ctr.inputs.move);
    if (player) {
      styleTimePoints(player, ctr.timePoints.timePoints);
    }
  }, 250);
}
