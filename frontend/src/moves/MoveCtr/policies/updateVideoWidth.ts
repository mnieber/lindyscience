import { MoveContainer } from 'src/moves/MoveCtr/MoveCtr';
import { CutVideoContainer } from 'src/video/CutVideoCtr';
import { reaction } from 'mobx';
import { onMakeCtrObservable } from 'skandha-mobx';

export function updateVideoWidth(ctr: MoveContainer | CutVideoContainer) {
  onMakeCtrObservable(ctr, () => {
    const cleanUpFunction = reaction(
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
      },
      {
        fireImmediately: true,
      }
    );
    ctr.addCleanUpFunction(cleanUpFunction);
  });
}
