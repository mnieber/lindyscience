// @flow

import { MoveContainer } from "screens/move_container/move_container";
import { reaction } from "utils/mobx_wrapper";

export function updateVideoWidth(ctr: MoveContainer) {
  reaction(
    () => {
      const maxVideoWidth = ctr.inputs.sessionDisplay
        ? ctr.inputs.sessionDisplay.maxVideoWidth
        : 100;
      const videoPanelWidth = ctr.display.videoPanelWidth
        ? ctr.display.videoPanelWidth
        : 100;
      return [maxVideoWidth, videoPanelWidth];
    },
    ([maxVideoWidth, videoPanelWidth]) => {
      ctr.display.videoWidth = Math.min(maxVideoWidth, videoPanelWidth - 10);
    }
  );
}
