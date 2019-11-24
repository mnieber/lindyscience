// @flow

import { CutVideoContainer } from "screens/cut_video_container/cut_video_container";
import { MoveContainer } from "screens/move_container/move_container";
import { reaction } from "utils/mobx_wrapper";

export function updateVideoWidth(ctr: MoveContainer | CutVideoContainer) {
  reaction(
    () => {
      const maxVideoWidth = ctr.inputs.sessionDisplay
        ? ctr.inputs.sessionDisplay.maxVideoWidth
        : 100;
      const videoPanelWidth = ctr.display.videoPanelWidth
        ? ctr.display.videoPanelWidth
        : 100;
      const maxWidthDictatedByScreen = (screen.height * 16) / 9;
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
