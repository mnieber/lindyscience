// @flow

import { createMoveFromCutPoint } from "screens/utils";
import { Inputs, initInputs } from "screens/cut_video_container/facets/inputs";
import { updateVideoWidth } from "screens/move_container/policies/update_video_width";
import { Display as SessionDisplay } from "screens/session_container/facets/display";
import { Display, initDisplay } from "screens/move_container/facets/display";
import {
  CutPoints,
  initCutPoints,
} from "screens/cut_video_container/facets/cut_points";
import {
  type GetFacet,
  facet,
  facetClass,
  installPolicies,
  registerFacets,
} from "facet";
import { runInAction } from "utils/mobx_wrapper";
import type { MoveListT } from "move_lists/types";
import type { UserProfileT } from "profiles/types";
import type { CutPointT } from "video/types";
import type { MoveT } from "moves/types";

export type CutVideoContainerPropsT = {
  rootDivId: string,
  saveMoves: (moves: Array<MoveT>, moveList: MoveListT) => any,
};

// $FlowFixMe
@facetClass
export class CutVideoContainer {
  @facet(Inputs) inputs: Inputs;
  @facet(Display) display: Display;
  @facet(CutPoints) cutPoints: CutPoints;

  _createFacets(props: CutVideoContainerPropsT) {
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

    registerFacets(this);
  }

  _applyPolicies(props: CutVideoContainerPropsT) {
    const policies = [updateVideoWidth];

    installPolicies(policies, this);
  }

  constructor(props: CutVideoContainerPropsT) {
    this._createFacets(props);
    this._applyPolicies(props);
  }

  static get: GetFacet<CutVideoContainer>;
}
