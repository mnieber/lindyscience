// @flow

import { Facet, installPolicies } from 'src/facet';
import { createMoveFromCutPoint } from 'src/screens/utils';
import {
  Inputs,
  initInputs,
} from 'src/screens/cut_video_container/facets/inputs';
import { updateVideoWidth } from 'src/screens/move_container/policies/update_video_width';
import {
  Display,
  initDisplay,
} from 'src/screens/move_container/facets/display';
import {
  CutPoints,
  initCutPoints,
} from 'src/screens/cut_video_container/facets/cut_points';
import type { MoveListT } from 'src/move_lists/types';
import type { CutPointT } from 'src/video/types';
import type { MoveT } from 'src/moves/types';

export type PropsT = {
  rootDivId: string,
  saveMoves: (moves: Array<MoveT>, moveList: MoveListT) => any,
};

export class CutVideoContainer {
  inputs: Inputs;
  display: Display;
  cutPoints: CutPoints;

  _createFacets(props: PropsT) {
    this.inputs = initInputs(new Inputs());
    this.cutPoints = initCutPoints(
      new CutPoints(),
      (cutPoint: CutPointT, videoLink: string) => {
        return createMoveFromCutPoint(
          cutPoint,
          videoLink,
          (this.inputs.userProfile: any),
          (this.inputs.moveList: any)
        );
      },
      (moves: Array<MoveT>) => {
        props.saveMoves(moves, (this.inputs.moveList: any));
      }
    );
    this.display = initDisplay(new Display(), props.rootDivId);
  }

  _applyPolicies(props: PropsT) {
    const policies = [updateVideoWidth];

    installPolicies(policies, this);
  }

  constructor(props: PropsT) {
    this._createFacets(props);
    this._applyPolicies(props);
  }
}
