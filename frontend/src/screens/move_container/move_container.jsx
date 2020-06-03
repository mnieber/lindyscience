// @flow

import { facet, installPolicies, registerFacets } from 'src/facet';
import { updateVideoWidth } from 'src/screens/move_container/policies/update_video_width';
import {
  VideoController,
  initVideoController,
} from 'src/screens/move_container/facets/video_controller';
import {
  TimePoints,
  initTimePoints,
} from 'src/screens/move_container/facets/time_points';
import { initVideoCtrFromCurrentMove } from 'src/screens/move_container/policies/init_video_ctr_from_current_move';
import { timePointsAreStyled } from 'src/screens/move_container/policies/time_points_are_styled';
import {
  Display,
  initDisplay,
} from 'src/screens/move_container/facets/display';
import { Inputs, initInputs } from 'src/screens/move_container/facets/inputs';

export type PropsT = { rootDivId: string };

export class MoveContainer {
  @facet inputs: Inputs;
  @facet display: Display;
  @facet timePoints: TimePoints;
  @facet videoController: VideoController;

  _createFacets(props: PropsT) {
    this.inputs = initInputs(new Inputs());
    this.display = initDisplay(new Display(), props.rootDivId);
    this.timePoints = initTimePoints(new TimePoints());
    this.videoController = initVideoController(new VideoController());

    registerFacets(this);
  }

  _applyPolicies(props: PropsT) {
    const policies = [
      timePointsAreStyled,
      initVideoCtrFromCurrentMove,
      updateVideoWidth,
    ];

    installPolicies(policies, this);
  }

  constructor(props: PropsT) {
    this._createFacets(props);
    this._applyPolicies(props);
  }
}
