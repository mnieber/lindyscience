import { MoveContainer } from 'src/moves/MoveCtr/MoveCtr';
import { CutVideoContainer } from 'src/video/CutVideoCtr';
import { declareReaction } from 'facility-mobx';

export function updateVideoWidth(ctr: MoveContainer | CutVideoContainer) {
  declareReaction(
    ctr,
    () => {
      const maxVideoWidth = ctr.inputs.sessionDisplay
        ? ctr.inputs.sessionDisplay.maxVideoWidth
        : 100;
      const videoPanelWidth = ctr.display.videoPanelWidth
        ? ctr.display.videoPanelWidth
        : 100;
      const maxWidthDictatedByScreen = (window.screen.height * 16) / 9;
      return [maxVideoWidth, videoPanelWidth, maxWidthDictatedByScreen];
    },
    ([maxVideoWidth, videoPanelWidth, maxWidthDictatedByScreen]) => {
      ctr.display.videoWidth = Math.min(
        maxVideoWidth,
        videoPanelWidth - 10,
        maxWidthDictatedByScreen
      );
    }
  );
}
