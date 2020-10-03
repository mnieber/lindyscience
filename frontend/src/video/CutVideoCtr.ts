// @flow

import { Display, initDisplay } from 'src/moves/MoveCtr/facets/Display';
import { installPolicies } from 'src/npm/facet';
import { moves } from 'src/tips/tests/data';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/move_lists/types';
import { CutPoints, initCutPoints } from 'src/video/facets/CutPoints';
import { CutPointT } from 'src/video/types';
import { updateVideoWidth } from 'src/moves/MoveCtr/policies/updateVideoWidth';
import { createMoveFromCutPoint } from 'src/app/utils';
import { Inputs, initInputs } from 'src/video/facets/Inputs';

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
