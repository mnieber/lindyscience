// @flow

import { Inputs, initInputs } from 'src/moves/MoveCtr/facets/Inputs';
import { Display, initDisplay } from 'src/moves/MoveCtr/facets/Display';
import {
  TimePoints,
  initTimePoints,
} from 'src/moves/MoveCtr/facets/TimePoints';
import {
  VideoController,
  initVideoController,
} from 'src/moves/MoveCtr/facets/VideoController';
import { timePointsAreStyled } from 'src/moves/MoveCtr/policies/timePointsAreStyled';
import { initVideoCtrFromCurrentMove } from 'src/moves/MoveCtr/policies/initVideoCtrFromCurrentMove';
import { updateVideoWidth } from 'src/moves/MoveCtr/policies/updateVideoWidth';
import { facet, installPolicies, registerFacets } from 'src/npm/facet';

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