// @flow

import type { MoveByIdT } from "moves/types";
import { runInAction } from "utils/mobx_wrapper";
import {
  Navigation,
  initNavigation,
} from "screens/session_container/facets/navigation";
import type { MoveListT } from "move_lists/types";
import { MovesContainer } from "screens/moves_container/moves_container";
import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import {
  Profiling,
  initProfiling,
} from "screens/session_container/facets/profiling";
import { Loading, initLoading } from "screens/session_container/facets/loading";
import type { UserProfileT } from "profiles/types";
import { Inputs, initInputs } from "screens/session_container/facets/inputs";
import { facet, facetClass } from "facet/index";
import { Policies } from "screens/session_container/policies";

type SessionContainerPropsT = {
  dispatch: Function,
  history: any,
};

// $FlowFixMe
@facetClass
export class SessionContainer {
  @facet(Inputs) inputs: Inputs;
  @facet(Loading) loading: Loading;
  @facet(Navigation) navigation: Navigation;
  @facet(Profiling) profiling: Profiling;

  @facet(MovesContainer) movesCtr: MovesContainer;
  @facet(MoveListsContainer) moveListsCtr: MoveListsContainer;

  _createFacets(props: SessionContainerPropsT) {
    this.inputs = initInputs(new Inputs(), props.dispatch);
    this.loading = initLoading(new Loading());
    this.navigation = initNavigation(new Navigation(), props.history);
    this.profiling = initProfiling(new Profiling());
  }

  constructor(props: SessionContainerPropsT) {
    this._createFacets(props);
  }

  setInputs(
    userProfile: ?UserProfileT,
    moveLists: Array<MoveListT>,
    moveById: MoveByIdT
  ) {
    runInAction("sessionContainer.setInputs", () => {
      this.inputs.userProfile = userProfile;
      this.inputs.moveById = moveById;
      this.inputs.moveLists = moveLists;
    });
  }
}

export const initSessionContainer = (
  self: SessionContainer,
  movesCtr: MovesContainer,
  moveListsCtr: MoveListsContainer
) => {
  self.movesCtr = movesCtr;
  self.moveListsCtr = moveListsCtr;

  [
    Policies.navigation.handleNavigateToMove,
    Policies.navigation.handleNavigateToMoveList,
    Policies.navigation.selectTheMoveListThatMatchesTheUrl,
    Policies.navigation.selectTheMoveThatMatchesTheUrl,

    Policies.profiling.handleLoadEmail,
    Policies.profiling.handleLoadUserProfileForSignedInEmail,
    Policies.profiling.handleSignOut,

    Policies.url.handleLoadSelectedMoveListFromUrl,

    Policies.data.updateMovesCtrInputs,
    Policies.data.updateMoveListsCtrInputs,
  ].forEach(policy => policy(self));
};
