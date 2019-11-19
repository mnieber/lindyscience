// @flow

import { updateVideoWidth } from "screens/move_container/policies/update_video_width";
import {
  VideoController,
  initVideoController,
} from "screens/move_container/facets/video_controller";
import {
  TimePoints,
  initTimePoints,
} from "screens/move_container/facets/time_points";
import type { MoveT } from "moves/types";
import {
  type GetFacet,
  facet,
  facetClass,
  installPolicies,
  registerFacets,
} from "facet";
import { Display as SessionDisplay } from "screens/session_container/facets/display";
import { initVideoCtrFromCurrentMove } from "screens/move_container/policies/init_video_ctr_from_current_move";
import { timePointsAreStyled } from "screens/move_container/policies/time_points_are_styled";
import { Display, initDisplay } from "screens/move_container/facets/display";
import { runInAction } from "utils/mobx_wrapper";
import { Inputs, initInputs } from "screens/move_container/facets/inputs";

export type MoveContainerPropsT = { rootDivId: string };

// $FlowFixMe
@facetClass
export class MoveContainer {
  @facet(Inputs) inputs: Inputs;
  @facet(Display) display: Display;
  @facet(TimePoints) timePoints: TimePoints;
  @facet(VideoController) videoCtr: VideoController;

  _createFacets(props: MoveContainerPropsT) {
    this.inputs = initInputs(new Inputs());
    this.display = initDisplay(new Display(), props.rootDivId);
    this.timePoints = initTimePoints(new TimePoints());
    this.videoCtr = initVideoController(new VideoController());

    registerFacets(this);
  }

  _applyPolicies(props: MoveContainerPropsT) {
    const policies = [
      timePointsAreStyled,
      initVideoCtrFromCurrentMove,
      updateVideoWidth,
    ];

    installPolicies(policies, this);
  }

  constructor(props: MoveContainerPropsT) {
    this._createFacets(props);
    this._applyPolicies(props);
  }

  setInputs(sessionDisplay: SessionDisplay, move: MoveT) {
    runInAction("moveContainer.setInputs", () => {
      this.inputs.move = move;
      this.inputs.sessionDisplay = sessionDisplay;
    });
  }

  static get: GetFacet<MoveContainer>;
}
