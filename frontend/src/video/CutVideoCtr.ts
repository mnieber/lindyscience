import { Display, initDisplay } from 'src/moves/MoveCtr/facets/Display';
import { installPolicies } from 'facet';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/move_lists/types';
import { CutPoints, initCutPoints } from 'src/video/facets/CutPoints';
import { CutPointT } from 'src/video/types';
import { updateVideoWidth } from 'src/moves/MoveCtr/policies/updateVideoWidth';
import { createMoveFromCutPoint } from 'src/app/utils';
import { Inputs, initInputs } from 'src/video/facets/Inputs';

export type PropsT = {
  rootDivId: string;
  saveMoves: (moves: Array<MoveT>, moveList: MoveListT) => any;
};

export class CutVideoContainer {
  inputs: Inputs;
  display: Display;
  cutPoints: CutPoints;

  _applyPolicies(props: PropsT) {
    const policies = [updateVideoWidth];

    installPolicies(policies, this);
  }

  constructor(props: PropsT) {
    this.inputs = initInputs(new Inputs());
    this.cutPoints = initCutPoints(
      new CutPoints(
        (cutPoint: CutPointT, videoLink: string) => {
          return createMoveFromCutPoint(
            cutPoint,
            videoLink,
            this.inputs.userProfile as any,
            this.inputs.moveList as any
          );
        },
        (moves: Array<MoveT>) => {
          props.saveMoves(moves, this.inputs.moveList as any);
        }
      )
    );
    this.display = initDisplay(new Display(), props.rootDivId);

    this._applyPolicies(props);
  }
}
