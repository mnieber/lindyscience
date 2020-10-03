import { MoveContainer } from 'src/moves/MoveCtr/MoveCtr';
import { scrollIntoView } from 'src/app/utils';
import jQuery from 'jquery';

function styleTimePoints(videoPlayer: any, timePoints: Array<number>) {
  const currentTime = videoPlayer ? videoPlayer.getCurrentTime() : -1;
  let hasScrolled = false;

  timePoints.forEach((tp) => {
    const className = '.tp-' + (tp + '').replace('.', '-');
    const elms = jQuery(className);
    elms.removeClass('bg-yellow');
    if (currentTime - 1 < tp && tp < currentTime + 1) {
      elms.addClass('bg-yellow');
      if (elms.length && !hasScrolled) {
        hasScrolled = true;
        scrollIntoView(elms[0], document.getElementById('move__description'));
      }
    }
  });
}

export function timePointsAreStyled(ctr: MoveContainer) {
  setInterval(() => {
    const player = ctr.videoController.getPlayer();
    ctr.timePoints.updateFrom(ctr.inputs.move, ctr.inputs.movePrivateData);
    if (player) {
      styleTimePoints(player, ctr.timePoints.timePoints);
    }
  }, 250);
}
