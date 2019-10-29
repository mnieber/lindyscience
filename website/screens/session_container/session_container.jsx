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
import type { UserProfileT } from "profiles/types";
import { Inputs, initInputs } from "screens/session_container/facets/inputs";
import { facet, facetClass, registerFacets, installPolicies } from "facet";
import { Policies } from "screens/session_container/policies";

type SessionContainerPropsT = {
  dispatch: Function,
  history: any,
  movesCtr: MovesContainer,
  moveListsCtr: MoveListsContainer,
};

// $FlowFixMe
@facetClass
export class SessionContainer {
  @facet(Inputs) inputs: Inputs;
  @facet(Navigation) navigation: Navigation;
  @facet(Profiling) profiling: Profiling;

  @facet(MovesContainer) movesCtr: MovesContainer;
  @facet(MoveListsContainer) moveListsCtr: MoveListsContainer;

  _createFacets(props: SessionContainerPropsT) {
    this.inputs = initInputs(new Inputs(), props.dispatch);
    this.navigation = initNavigation(new Navigation(), props.history);
    this.profiling = initProfiling(new Profiling());
    this.movesCtr = props.movesCtr;
    this.moveListsCtr = props.moveListsCtr;

    registerFacets(this);
  }

  _applyPolicies(props: SessionContainerPropsT) {
    const policies = [
      Policies.navigation.handleNavigateToMove,
      Policies.navigation.handleNavigateToMoveList,
      Policies.navigation.selectTheMoveListThatMatchesTheUrl,
      Policies.navigation.syncMoveWithCurrentUrl,
      Policies.navigation.syncUrlWithNewMove,

      Policies.profiling.handleLoadUserProfileForSignedInEmail,
      Policies.profiling.handleLoadEmail,
      Policies.profiling.handleSignIn,
      Policies.profiling.handleSignOut,

      Policies.url.handleLoadSelectedMoveListFromUrl,

      Policies.data.updateMovesCtrInputs,
      Policies.data.updateMoveListsCtrInputs,
    ];

    installPolicies(policies, this);
  }

  constructor(props: SessionContainerPropsT) {
    this._createFacets(props);
    this._applyPolicies(props);
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
